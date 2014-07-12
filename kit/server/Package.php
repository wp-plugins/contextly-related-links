<?php

class ContextlyKitPackageManager extends ContextlyKitBase {

  /**
   * @var ContextlyKitPackageSettings
   */
  protected $settings;

  /**
   * @var ContextlyKitAssetsManager
   */
  protected $assetsManager;

  /**
   * @var \Symfony\Component\Filesystem\Filesystem
   */
  protected $fs;

  /**
   * @var ContextlyKitPackageMediaAggregator
   */
  protected $mediaAggregator;

  /**
   * @var ContextlyKitPackageCssAggregator
   */
  protected $cssAggregator;

  /**
   * @var ContextlyKitPackageTemplatesAggregator
   */
  protected $tplAggregator;

  /**
   * @var ContextlyKitPackageJsAggregator
   */
  protected $jsAggregator;

  /**
   * @var string
   */
  protected $tempPath;

  public function __construct($kit) {
    parent::__construct($kit);

    $iniPath = $this->kit->getFolderPath('console', TRUE) . '/settings.ini';
    $this->settings = $this->kit->newPackageSettings($iniPath);
    $this->assetsManager = $this->kit->newAssetsManager();
    $this->fs = new \Symfony\Component\Filesystem\Filesystem();

    // Set up logging.
    $this->log = new \Monolog\Logger('log');
    $this->log->pushHandler(new \Monolog\Handler\StreamHandler('php://stdout'));

    $this->mediaAggregator = $this->kit->newPackageMediaAggregator($this);
    $this->cssAggregator = $this->kit->newPackageCssAggregator($this);
    $this->tplAggregator = $this->kit->newPackageTemplatesAggregator($this);
    $this->jsAggregator = $this->kit->newPackageJsAggregator($this);
  }

  public function checkRequirements() {
    // TODO Check that all required binaries are installed.
    // TODO Make sure we're NOT in safe mode (to call exec())
    // TODO Make sure we're at least on PHP 5.3 for namespaces.
    // TODO Make sure we're at least on PHP 5.4 for \RecursiveCallbackFilterIterator.
  }

  public function cleanupAggregated() {
    $paths = array(
      $this->kit->getFolderPath('client/aggregated', TRUE),
      $this->kit->getFolderPath('config/aggregated', TRUE),
    );
    foreach ($paths as $path) {
      if (file_exists($path)) {
        $iterator = new \FilesystemIterator($path);
        $this->fs->remove($iterator);
      }
      else {
        $this->fs->mkdir($path);
      }
    }
  }

  protected function aggregateLicenses() {
    // TODO Automatically extract and aggregate all the licenses.
    $filename = 'licenses.txt';
    $source = $this->kit->getFolderPath('client/src', TRUE) . '/' . $filename;
    $target = $this->kit->getFolderPath('client/aggregated', TRUE) . '/' . $filename;
    $this->fs->copy($source, $target);
  }

  public function getLicenseInfo($version) {
    if (empty($this->settings['aggregator']['license'])) {
      return '';
    }

    $uploaderConfig = $this->getUploaderConfig('assets');
    $url = strtr($this->settings['aggregator']['license'], array(
      '{version}' => $version,
      '{container}' => $uploaderConfig['container'],
      '{folder}' => $uploaderConfig['folder'],
    ));
    return 'For licensing information see ' . $url;
  }

  public function aggregateAssets($version) {
    $this->log->addInfo('Preparing folders for aggregated files.');
    $this->cleanupAggregated();

    // Discover packages.
    $aggregate = $this->assetsManager->discoverPackagesToAggregate();
    if (empty($aggregate)) {
      $this->log->addInfo('No packages to aggregate.');
      return;
    }

    // Copy license file.
    $this->aggregateLicenses();

    foreach ($aggregate as $packageName) {
      $this->log->addInfo('Aggregating "' . $packageName . '" package assets.');

      $assets = $this->kit->newAssetsList();
      $this->assetsManager->extractPackageAssets($packageName, $assets);

      $config = $this->kit->newAssetsConfigAggregated($this, $packageName);
      $this->mediaAggregator->aggregate($packageName, $assets, $version, $config);
      $this->cssAggregator->aggregate($packageName, $assets, $version, $config);
      $this->jsAggregator->aggregate($packageName, $assets, $version, $config);
      $this->tplAggregator->aggregate($packageName, $assets, $version, $config);

      if ($config->save()) {
        $this->log->addInfo('Aggregated config of the "' . $packageName . '" package saved successfully.');
      }
      else {
        $this->log->addError('Unable to save aggregated config of the "' . $packageName . '" package.');
      }
    }

    $this->log->addInfo('Assets aggregation finished.');
  }

  protected function getUploaderConfig($subkey) {
    $config = array();

    $keys = array("uploader.$subkey", 'uploader');
    foreach ($keys as $key) {
      if (!empty($this->settings[$key])) {
        $config += $this->settings[$key];
      }
    }

    return $config;
  }

  public function buildArchives($version, $override = FALSE) {
    $this->log->addInfo("Building kit archives of $version version.");

    $archiver = $this->kit->newPackageArchiver($this, $this->getArchiverConfig($version));
    foreach ($this->settings['archiver']['formats'] as $type) {
      if (!$archiver->typeSupported($type)) {
        $this->log->addError("Archive type $type not supported.");
        continue;
      }

      if (!$override) {
        $filepath = $archiver->getArchiveFilepath($type);
        if (file_exists($filepath)) {
          $this->log->addError("Archive of $type type already exists and will NOT be overwritten.");
          continue;
        }
      }

      $archiver->buildKitArchive($type);
      $this->log->addInfo("Archive of $type type created successfully.");
    }
  }

  protected function getArchiverConfig($version) {
    $config = array(
      'version' => $version,
    );

    if (!empty($this->settings['archiver'])) {
      $config += $this->settings['archiver'];
      unset($config['formats']);
    }

    $config += array(
      'exclude' => array(),
    );

    return $config;
  }

  public function uploadAssets($version, $override = FALSE) {
    $this->log->addInfo("Uploading aggregated assets of $version version.");

    $config = $this->getUploaderConfig('assets');
    $uploader = $this->kit->newPackageUploader($this, $config);
    $path = $this->kit->getFolderPath('client/aggregated', TRUE);
    if ($uploader->uploadDirectory($path, $version, $override)) {
      $this->log->addInfo('Aggregated assets uploaded successfully.');
    }
    else {
      $this->log->addError('Aggregated assets were NOT uploaded.');
    }
  }

  public function uploadArchives($version, $override = FALSE) {
    $this->log->addInfo("Uploading kit archives of $version version.");

    $archiverConfig = $this->getArchiverConfig($version);
    $archiver = $this->kit->newPackageArchiver($this, $archiverConfig);
    $uploaderConfig = $this->getUploaderConfig('archives');
    $uploader = $this->kit->newPackageUploader($this, $uploaderConfig);
    foreach ($this->settings['archiver']['formats'] as $type) {
      $filePath = $archiver->getArchiveFilepath($type);
      if (!file_exists($filePath)) {
        $this->log->addError("Archive of $type type not found and will NOT be uploaded.");
        continue;
      }

      $fileName = basename($filePath);
      if ($uploader->uploadFile($filePath, $fileName, $override)) {
        $this->log->addInfo("Archive of $type type was uploaded successfully.");
      }
      else {
        $this->log->addError("Archive of $type type was NOT uploaded.");
      }
    }
  }

  protected function compactInt($int) {
    return base_convert((int) $int, 10, 36);
  }

  public function getTempPath() {
    if (!isset($this->tempPath)) {
      $temp = $this->settings['paths']['temp'];
      if (empty($temp)) {
        throw $this->kit->newException('Temporary path is not set.');
      }

      if (!is_writable($temp)) {
        throw $this->kit->newException("Temporary path $temp is not writable.");
      }

      $temp = $temp . '/contextly-' . $this->compactInt($_SERVER['REQUEST_TIME']) . $this->compactInt(mt_rand());
      $this->fs->mkdir($temp);

      $this->tempPath = $temp;
    }

    return $this->tempPath;
  }

  public function getFs() {
    return $this->fs;
  }

  public function getLog() {
    return $this->log;
  }

  /**
   * Builds path of the file relative to specified directory.
   *
   * @param string $filePath
   * @param string $startDir
   */
  public function buildRelativeFilePath($filePath, $startDir) {
    $fileDir = dirname($filePath);
    $fileName = basename($filePath);

    $relativePath = $this->fs->makePathRelative($fileDir, $startDir);
    if ($relativePath === './') {
      $relativePath = '';
    }

    return $relativePath . $fileName;
  }

  function __destruct() {
    // Cleanup temporary folder.
    if (isset($this->tempPath)) {
      $this->fs->remove($this->tempPath);
    }
  }

}

class ContextlyKitPackageSettings extends ContextlyKitBase implements ArrayAccess {

  protected $path;

  protected $data;

  public function __construct($kit, $path) {
    parent::__construct($kit);

    $this->path = $path;
  }

  protected function load() {
    if (isset($this->data)) {
      return;
    }

    $this->data = array();
    $data = parse_ini_file($this->path, TRUE);
    if ($data) {
      $this->data = $data;
    }
  }

  /**
   * Whether a offset exists
   *
   * @param mixed $offset
   *   An offset to check for.
   *
   * @return boolean
   *   true on success or false on failure.
   */
  public function offsetExists($offset) {
    $this->load();
    return array_key_exists($offset, $this->data);
  }

  /**
   * Offset to retrieve
   *
   * @param mixed $offset
   *   The offset to retrieve.
   *
   * @return mixed
   *   Can return all value types.
   */
  public function offsetGet($offset) {
    $this->load();
    return $this->data[$offset];
  }

  /**
   * Offset to set
   *
   * @param mixed $offset
   *   The offset to assign the value to.
   * @param mixed $value
   *   The value to set.
   */
  public function offsetSet($offset, $value) {
    $this->throwReadOnly();
  }

  /**
   * (PHP 5 &gt;= 5.0.0)<br/>
   * Offset to unset
   * @link http://php.net/manual/en/arrayaccess.offsetunset.php
   *
   * @param mixed $offset <p>
   * The offset to unset.
   * </p>
   *
   * @return void
   */
  public function offsetUnset($offset) {
    $this->throwReadOnly();
  }

  protected function throwReadOnly() {
    throw $this->kit->newException('Package settings are read-only');
  }

}

abstract class ContextlyKitPackageAssetsAggregator extends ContextlyKitBase {

  /**
   * @var ContextlyKitPackageManager
   */
  protected $manager;

  /**
   * @var \Symfony\Component\Filesystem\Filesystem
   */
  protected $fs;

  protected $sourceBase;
  protected $targetBase;

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitPackageManager $manager
   */
  public function __construct($kit, $manager) {
    parent::__construct($kit);

    $this->manager = $manager;
    $this->fs = $manager->getFs();

    $this->sourceBase = $this->kit->getFolderPath('client/src', TRUE);
    $this->targetBase = $this->kit->getFolderPath('client/aggregated', TRUE);
  }

  protected function getAssetFileName($packageName) {
    return str_replace('/', '--', $packageName);
  }

  /**
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   * @param string $version
   * @param \ContextlyKitAssetsConfigAggregated $config
   *
   * @return mixed
   */
  abstract public function aggregate($packageName, $assets, $version, &$config);

}

class ContextlyKitPackageMediaAggregator extends ContextlyKitPackageAssetsAggregator {

  protected $aggregated = array();

  /**
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   * @param ContextlyKitAssetsConfigAggregated $version
   * @param ContextlyKitAssetsConfigAggregated $config
   *
   * @return mixed|void
   */
  public function aggregate($packageName, $assets, $version, &$config) {
    $media = $assets->getMedia();
    if (empty($media)) {
      return;
    }

    foreach ($media as $path) {
      if (isset($this->aggregated[$path])) {
        continue;
      }
      $this->aggregated[$path] = TRUE;

      $source_path = $this->sourceBase . '/' . $path;
      $target_path = $this->targetBase . '/' . $path;
      if (is_dir($source_path)) {
        $this->fs->mirror($source_path, $target_path, NULL, array('override' => TRUE));
      }
      else {
        $this->fs->copy($source_path, $target_path, TRUE);
      }
    }
  }

}

class ContextlyKitPackageCssAggregator extends ContextlyKitPackageAssetsAggregator {

  protected $minified = array();

  /**
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   * @param ContextlyKitAssetsConfigAggregated $version
   * @param ContextlyKitAssetsConfigAggregated $config
   * @return mixed|void
   */
  public function aggregate($packageName, $assets, $version, &$config) {
    $css = $assets->getCss();
    if (empty($css)) {
      return;
    }

    $target_name = $this->getAssetFileName($packageName);
    $target_path = $this->targetBase . '/' . $target_name . '.css';

    $output = fopen($target_path, 'wb');
    fwrite($output, '/* ' . $this->manager->getLicenseInfo($version) . ' */');
    foreach ($css as $path) {
      $minified_path = $this->minifyFile($path);

      $minified = fopen($minified_path, 'rb');
      stream_copy_to_stream($minified, $output);
      fwrite($output, "\n");
    }
    fclose($output);

    // Fill the aggregated config.
    $config->css[] = $target_name;
  }

  protected function minifyFile($path) {
    if (!isset($this->minified[$path])) {
      $source_path = $this->sourceBase . '/' . $path . '.css';
      $content = file_get_contents($source_path);

      // Load CSS file and fix media URLs.
      $parser = new \Sabberworm\CSS\Parser($content);
      $document = $parser->parse();
      $document = $this->updateMediaUrls($document, dirname($source_path));

      // Create temporary folder and save copyright + minified CSS there.
      $tmp_path = $this->manager->getTempPath() . '/' . $path . '.css';
      $this->fs->mkdir(dirname($tmp_path));
      file_put_contents($tmp_path, trim($document));

      $this->minified[$path] = $tmp_path;
    }

    return $this->minified[$path];
  }

  /**
   * @param \Sabberworm\CSS\CSSList\Document $document
   * @param $source_folder
   *
   * @return \Sabberworm\CSS\CSSList\Document
   */
  protected function updateMediaUrls($document, $source_folder) {
    $urls = $this->extractMediaUrls($document);
    foreach ($urls as $url) {
      /**
       * @var \Sabberworm\CSS\Value\URL $url
       */
      $url_value = $url->getURL()
        ->getString();
      if (!stream_is_local($url_value)) {
        continue;
      }

      // Cut-off URL arguments and/or fragment.
      $url_suffix = '';
      $pattern = '@[\?\#].*$@';
      if (preg_match($pattern, $url_value, $matches)) {
        $url_suffix = $matches[0];
        $url_value = preg_replace($pattern, '', $url_value);
      }

      // Resolve double dots and other relative things on the path.
      $real_path = realpath($source_folder . '/' . $url_value);
      if ($real_path === FALSE) {
        throw $this->kit->newException('Unable to build aggregated path for the media "' . $url_value . '" on the CSS file.');
      }

      // Build media path relative to the "client/src" folder, it will be
      // exactly the same from "client/aggregated" folder.
      $relative_path = $this->manager->buildRelativeFilePath($real_path, $this->sourceBase);

      // Set updated media URL back to the document.
      $aggregated_url = $relative_path . $url_suffix;
      $url->setURL(new \Sabberworm\CSS\Value\String($aggregated_url));
    }

    return $document;
  }

  /**
   * Returns URLs of images, fonts, etc. found on the document.
   *
   * @param \Sabberworm\CSS\CSSList\Document $document
   */
  protected function extractMediaUrls($document) {
    $results = array();
    $values = $document->getAllValues(NULL, TRUE);
    foreach ($values as $value) {
      if ($value instanceof \Sabberworm\CSS\Value\URL) {
        $results[] = $value;
      }
    }
    return $results;
  }

}

class ContextlyKitPackageTemplatesAggregator extends ContextlyKitPackageAssetsAggregator {

  /**
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   * @param $version
   * @param \ContextlyKitAssetsConfigAggregated $config
   * @return mixed
   */
  public function aggregate($packageName, $assets, $version, &$config) {
    $templates = $assets->getTpl();
    if (empty($templates)) {
      return;
    }

    $target_name = $this->getAssetFileName($packageName) . '.tpl';
    $temp_base = $this->manager->getTempPath();

    // Compile templates at once into a single file. We can't override template
    // name, so we just move them all to a temporary folder with proper names.
    $compiled_path = $temp_base . '/' . $target_name . '.js';
    $command = $this->kit->newExecCommand('handlebars');
    foreach ($templates as $name => $path) {
      $temp_path = $temp_base . '/' . $path . '/' . $name . '.handlebars';
      $this->fs->copy($this->sourceBase . '/' . $path . '.handlebars', $temp_path);
      $command->file($temp_path);
    }
    $command
      ->args(array(
        'namespace' => 'Contextly.templates',
        'output' => $compiled_path,
      ))
      ->errorsOutput()
      ->exec()
      ->requireSuccess('Unable to compile "' . $packageName . '" package templates.');

    $target_path = $this->targetBase . '/' . $target_name . '.js';
    $this->kit->newExecCommand('uglifyjs')
      ->file($compiled_path)
      ->args(array(
        'output' => $target_path,
        'compress' => NULL,
      ))
      ->errorsOutput()
      ->exec()
      ->requireSuccess('Unable to compress compiled "' . $packageName . '" package templates');


    // Fill the aggregated config.
    $config->js[] = $target_name;
  }

}

class ContextlyKitPackageJsAggregator extends ContextlyKitPackageAssetsAggregator {

  /**
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   * @param ContextlyKitAssetsConfigAggregated $version
   * @param \ContextlyKitAssetsConfigAggregated $config
   * @return mixed
   */
  public function aggregate($packageName, $assets, $version, &$config) {
    $js = $assets->getJs();
    if (empty($js)) {
      return;
    }

    // For source maps to work properly we should serve source files from CDN
    // too, so we mirror JS source to the aggregated folder and then compile
    // them all into a single file.
    $command = $this->kit->newExecCommand('uglifyjs');
    foreach ($js as $path) {
      $source_path = $this->sourceBase . '/' . $path . '.js';
      $copy_path = $this->targetBase . '/' . $path . '.js';
      $this->fs->copy($source_path, $copy_path);

      $command->file($copy_path);
    }

    $target_name = $this->getAssetFileName($packageName);
    $target_path = $this->targetBase . '/' . $target_name . '.js';
    $map_path = $this->targetBase . '/' . $target_name . '.map';
    $command
      ->args(array(
        'output' => $target_path,
        'compress' => NULL,
        'source-map' => $map_path,
        'prefix' => 'relative',
        'preamble' => '/* ' . $this->manager->getLicenseInfo($version) . ' */',
      ))
      ->errorsOutput()
      ->exec()
      ->requireSuccess('Unable to aggregate JS files of the "' . $packageName . '" package.');

    // Fill the aggregated config.
    $config->js[] = $target_name;
  }

}

abstract class ContextlyKitPackageUploader extends ContextlyKitBase {

  /**
   * @var array
   */
  protected $config;

  /**
   * @var ContextlyKitPackageManager
   */
  protected $manager;

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitPackageManager $manager
   * @param array $config
   */
  public function __construct($kit, $manager, $config) {
    parent::__construct($kit);

    $this->manager = $manager;
    $this->config = $config;
    $this->validateConfig();
  }

  /**
   * @param string $sourcePath
   *   Path to the local directory.
   * @param string|null $remoteSubfolder
   *   No leading or trailing slashes. Pass empty string to use root on remote
   *   side.
   * @param bool $override
   *   Whether to override existing files and folders or not.
   *
   * @return bool
   */
  abstract public function uploadDirectory($sourcePath, $remoteSubfolder = '', $override = FALSE);

  /**
   * @param $sourcePath
   *   Path to the local file.
   * @param $remotePath
   *   Complete remote path, including filename.
   * @param bool $override
   *   Whether to override existing files and folders or not.
   *
   * @return bool
   */
  abstract public function uploadFile($sourcePath, $remotePath, $override = FALSE);

  abstract protected function validateConfig();

}

class ContextlyKitPackageCloudFilesUploader extends ContextlyKitPackageUploader {

  /**
   * @var \OpenCloud\OpenStack
   */
  protected $client;

  /**
   * @var \OpenCloud\ObjectStore\Service
   */
  protected $service;

  /**
   * @var \OpenCloud\ObjectStore\Resource\Container
   */
  protected $container;

  public function __construct($kit, $manager, $config) {
    parent::__construct($kit, $manager, $config);

    $endpoint = $this->getEndpoints($this->config['endpoint']);
    $secret = array_intersect_key($this->config, array_flip(array('username', 'apiKey')));
    $this->client = new \OpenCloud\Rackspace($endpoint, $secret);
    $this->service = $this->client->objectStoreService('cloudFiles', $this->config['region']);
    $this->container = $this->service->getContainer($this->config['container']);
  }

  protected function getEndpoints($key = NULL) {
    static $endpoints = array(
      'US' => \OpenCloud\Rackspace::US_IDENTITY_ENDPOINT,
      'UK' => \OpenCloud\Rackspace::UK_IDENTITY_ENDPOINT,
    );
    if (isset($key)) {
      return $endpoints[$key];
    }
    else {
      return $endpoints;
    }
  }

  protected function validateConfig() {
    // Filter-out empty values.
    $this->config = array_filter($this->config);

    // Add defaults.
    $this->config += array(
      'endpoint' => 'US',
      'region' => '',
      'folder' => '',
    );

    // Check required.
    $required = array_flip(array(
      'username',
      'apiKey',
      'container',
    ));
    $missing = array_diff_key($required, $this->config);
    if (!empty($missing)) {
      $missing = implode(', ', array_keys($missing));
      throw $this->kit->newException('Required config parameters missing: ' . $missing);
    }

    // Validate endpoint.
    $endpoints = $this->getEndpoints();
    $endpoint_key = $this->config['endpoint'];
    if (!isset($endpoints[$endpoint_key])) {
      throw $this->kit->newException('Unknown endpoint ' . $endpoint_key . ' set on config.');
    }
  }

  protected function alterRemotePath($remotePath) {
    if (isset($this->config['folder']) && $this->config['folder'] !== '') {
      if ($remotePath !== '') {
        $remotePath = '/' . $remotePath;
      }
      $remotePath = $this->config['folder'] . $remotePath;
    }

    return $remotePath;
  }

  /**
   * @param $sourcePath
   *   Path to the local file.
   * @param $remotePath
   *   Complete remote path, including filename.
   * @param bool $override
   *   Whether to override existing file or not.
   *
   * @return bool
   */
  public function uploadFile($localPath, $remotePath, $override = FALSE) {
    $remotePath = $this->alterRemotePath($remotePath);

    if (!$override) {
      try {
        $this->container->getPartialObject($remotePath);
        $this->manager->getLog()
          ->addError("File '$localPath' already exists at remote path '$remotePath' and will NOT be uploaded.");
        return FALSE;
      }
      catch (\Guzzle\Http\Exception\ClientErrorResponseException $e) {
        // This kind of exception means 4xx HTTP status returned, make sure it's
        // 404, which means it's safe to continue upload.
        if (!$e->getResponse()->getStatusCode() == 404) {
          throw $e;
        }
      }
    }

    $handle = fopen($localPath, 'rb');
    if (!$handle) {
      throw $this->kit->newException('Unable to open file for reading: ' . $localPath);
    }

    $object = $this->container->uploadObject($remotePath, $handle);
    fclose($handle);

    // For fonts set Access-Control-Allow-Origin header.
    static $cors_extensions = array(
      'otf' => TRUE,
      'eot' => TRUE,
      'svg' => TRUE,
      'ttf' => TRUE,
      'woff' => TRUE,
    );
    if (preg_match('@\.([a-z]+)$@iu', $remotePath, $matches)) {
      $extension = strtolower($matches[1]);
      if (isset($cors_extensions[$extension])) {
        $metadata = $object->appendToMetadata(array(
          'Access-Control-Allow-Origin' => '*',
        ));
        $object->saveMetadata($metadata);
      }
    }

    return TRUE;
  }

  /**
   * @param string $sourcePath
   *   Path to the local file or folder.
   * @param string|null $remoteSubfolder
   *   No leading or trailing slashes. Pass NULL to use root on remote side.
   * @param bool $override
   *   Whether to override existing files and folders or not.
   *
   * @return bool
   *
   * @todo Use uploadObjects() method to upload all files at once.
   */
  public function uploadDirectory($sourcePath, $remoteSubfolder = '', $override = FALSE) {
    if (!$override) {
      $searchParams = array(
        'limit' => 1,
      );
      $searchPath = $this->alterRemotePath($remoteSubfolder);
      if ($searchPath !== '') {
        $searchParams['path'] = $searchPath;
      }
      $list = $this->container->objectList($searchParams);
      if ($list->count()) {
        $this->manager->getLog()
          ->addError("Remote path '$searchPath' already has files inside, local folder '$sourcePath' will NOT be uploaded.");
        return FALSE;
      }
    }

    if ($remoteSubfolder !== '') {
      $remoteSubfolder .= '/';
    }

    $flags = \RecursiveDirectoryIterator::FOLLOW_SYMLINKS | \RecursiveDirectoryIterator::SKIP_DOTS;
    $dirIterator = new \RecursiveDirectoryIterator($sourcePath, $flags);
    $mode = \RecursiveIteratorIterator::LEAVES_ONLY;
    $iterator = new \RecursiveIteratorIterator($dirIterator, $mode);
    foreach ($iterator as $fileInfo) {
      /**
       * @var SplFileInfo $fileInfo
       */
      $localPath = $fileInfo->getPathname();
      $relativePath = $this->manager->buildRelativeFilePath($localPath, $sourcePath);
      $remotePath = $remoteSubfolder . $relativePath;

      // We handle "override" option on the folder-level to avoid extra requests
      // for each uploaded file. If we reached this point, it's safe to override.
      $this->uploadFile($localPath, $remotePath, TRUE);
    }

    return TRUE;
  }

}

class ContextlyKitPackageArchiver extends ContextlyKitBase {

  /**
   * @var array
   */
  protected $config;

  /**
   * @var ContextlyKitPackageManager
   */
  protected $manager;

  /**
   * @var \Symfony\Component\Filesystem\Filesystem
   */
  protected $fs;

  /**
   * @var array
   */
  protected $exclude = array();

  /**
   * @var string
   */
  protected $rootPath;

  /**
   * @var string
   */
  protected $tempPath;

  /**
   * @var string
   */
  protected $targetPath;

  /**
   * @var \RecursiveIteratorIterator
   */
  protected $iterator;

  /**
   * @var bool
   */
  protected $initialized = FALSE;

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitPackageManager $manager
   */
  public function __construct($kit, $manager, $config) {
    parent::__construct($kit);

    $this->manager = $manager;
    $this->config = $config;
    $this->fs = $manager->getFs();

    $this->rootPath = $this->kit->getRootPath();
    $this->tempPath = $this->manager->getTempPath() . '/archives';
    $this->targetPath = $this->kit->getFolderPath('releases', TRUE);
  }

  protected function fillExclusions($rootPath) {
    $this->exclude = array();
    foreach ($this->config['exclude'] as $localPath) {
      $this->exclude[$rootPath . '/' . trim($localPath, '/\/')] = TRUE;
    }
  }

  protected function init() {
    if ($this->initialized) {
      return;
    }
    $this->initialized = TRUE;

    $this->fs->mkdir($this->tempPath);
    $this->fs->mkdir($this->targetPath);
    $this->fillExclusions($this->rootPath);

    // Build iterator with callback to filter-out unwanted files and folders
    // from the archive.
    $flags = \RecursiveDirectoryIterator::FOLLOW_SYMLINKS | \RecursiveDirectoryIterator::SKIP_DOTS;
    $dir = new \RecursiveDirectoryIterator($this->rootPath, $flags);
    $filtered = new \RecursiveCallbackFilterIterator($dir, array($this, 'filterArchiveContent'));
    $this->iterator = new \RecursiveIteratorIterator($filtered);
  }

  /**
   * @param SplFileInfo $current
   * @param string $key
   * @param \RecursiveDirectoryIterator $iterator
   */
  public function filterArchiveContent($current, $key, $iterator) {
    $filePath = $current->getPathname();
    return !isset($this->exclude[$filePath]);
  }

  protected function getTypeInfo($type = NULL) {
    static $types = array(
      'tar.gz' => array(
        'extension' => 'tar',
        'suffix' => 'gz',
        'format' => \Phar::TAR,
        'compression' => \Phar::GZ,
      ),
      'zip' => array(
        'extension' => 'zip',
        'format' => \Phar::ZIP,
      ),
    );
    if (!isset($type)) {
      return $types;
    }
    elseif (isset($types[$type])) {
      return $types[$type];
    }
    else {
      return FALSE;
    }
  }

  public function buildKitArchive($type) {
    $this->init();

    $info = $this->getTypeInfo($type);
    $version = $this->config['version'];
    $tempFilepath = $this->tempPath . '/archive.' . $info['extension'];

    // Create kit archive on the temporary path first.
    $archive = new \PharData($tempFilepath, NULL, NULL, $info['format']);
    $archive->buildFromIterator($this->iterator, $this->rootPath);
    $archive->addFromString('version', $version);

    if (!empty($info['compression']) && !empty($info['suffix'])) {
      $archive->compress($info['compression'], $info['extension'] . '.' . $info['suffix']);

      // Remove uncompressed file and add suffix to the temp file path.
      unlink($tempFilepath);
      $tempFilepath .= '.' . $info['suffix'];
    }

    $targetFilepath = $this->getArchiveFilepath($type);
    $this->fs->rename($tempFilepath, $targetFilepath, TRUE);
  }

  public function getArchiveFilepath($type) {
    $info = $this->getTypeInfo($type);
    $filename = $this->config['prefix'] . $this->config['version'] . '.' . $info['extension'];
    if (isset($info['suffix'])) {
      $filename .= '.' . $info['suffix'];
    }
    return $this->targetPath . '/' . $filename;
  }

  public function typeSupported($type) {
    $info = $this->getTypeInfo($type);
    return !empty($info);
  }

}
