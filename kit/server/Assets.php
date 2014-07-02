<?php

class ContextlyKitAssetsManager extends ContextlyKitBase {

  protected $configs = array();

  protected $configsPath;

  public function __construct($kit) {
    parent::__construct($kit);

    $this->configsPath = $this->kit->getFolderPath('config', TRUE);
  }

  protected function getConfig($packageName) {
    if (!isset($this->configs[$packageName])) {
      $path = $this->configsPath . '/' . $packageName . '.json';
      $this->configs[$packageName] = $this->kit->newAssetsConfig($path);
    }

    return $this->configs[$packageName];
  }

  protected function resolveDependencies($parentName) {
    $configs = array(
      $parentName => $this->getConfig($parentName),
    );

    for ($i = 0; $i < count($configs); $i++) {
      $slice = array_slice($configs, $i, 1);
      $config = reset($slice);

      if (empty($config->include)) {
        continue;
      }

      foreach ($config->include as $package) {
        if (isset($configs[$package])) {
          continue;
        }

        $configs[$package] = $this->getConfig($package);
      }
    }

    // Reverse array to include dependencies in right order.
    return array_reverse($configs);
  }

  /**
   * Adds assets of the specified package to the assets list.
   *
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
   *
   * @return ContextlyKitAssetsList
   */
  function extractPackageAssets($packageName, $assets) {
    $configs = $this->resolveDependencies($packageName);
    foreach ($configs as $config) {
      $assets->parseConfig($config);
    }
  }

  function discoverPackages() {
    $root = $this->configsPath;

    $paths = array(
      $root,
    );
    $configs = array();
    for ($i = 0; $i < count($paths); $i++) {
      $files = glob($paths[$i] . '/*.json');
      foreach ($files as $file) {
        if (is_file($file)) {
          $configs[] = $file;
        }
      }

      $subdirs = glob($paths[$i] . '/*', GLOB_ONLYDIR);
      if ($subdirs) {
        $paths = array_merge($paths, $subdirs);
      }
    }

    $patterns = array(
      '@^' . preg_quote($root . '/', '@') . '@',
      '@\.json$@',
    );
    $packages = preg_replace($patterns, '', $configs);
    return $packages;
  }

  function discoverPackagesToAggregate() {
    $packages = $this->discoverPackages();
    $aggregate = array();
    foreach ($packages as $packageName) {
      $config = $this->getConfig($packageName);
      if (!empty($config->aggregate)) {
        $aggregate[] = $packageName;
      }
    }
    return $aggregate;
  }

}

class ContextlyKitAssetsConfig extends ContextlyKitBase {

  protected $config;

  protected $filepath;

  function __construct($kit, $path) {
    parent::__construct($kit);

    $this->filepath = $path;
  }

  protected function load() {
    // Load only once.
    if (isset($this->config)) {
      return;
    }

    if (!file_exists($this->filepath)) {
      throw $this->kit->newException("Unable to load config at {$this->filepath}");
    }

    $content = file_get_contents($this->filepath);
    if ($content === FALSE) {
      throw $this->kit->newException("Config at {$this->filepath} is empty.");
    }

    $config = json_decode($content);
    if (!isset($config)) {
      throw $this->kit->newException("Unable to decode config at {$this->filepath}");
    }

    $this->config = $config;
  }

  function getFilepath() {
    return $this->filepath;
  }

  function __isset($name) {
    $this->load();
    return isset($this->config->{$name});
  }

  function __get($name) {
    $this->load();
    return $this->config->{$name};
  }

}

class ContextlyKitAssetsList extends ContextlyKitBase {

  protected $js = array();

  protected $css = array();

  protected $tpl = array();

  protected $media = array();

  function extractAssets($base, $key, ContextlyKitAssetsConfig $config) {
    if (!isset($config->{$key})) {
      return;
    }

    $parsed = array();
    foreach ($config->{$key} as $filepath) {
      if (!is_string($filepath)) {
        $subkey = $this->settings->mode;
        if (!isset($filepath->{$subkey})) {
          continue;
        }
        $filepath = $filepath->{$subkey};
      }

      $parsed[$base . $filepath] = TRUE;
    }

    if (!empty($parsed)) {
      $this->{$key} += $parsed;
    }
  }

  protected function extractTpl($base, ContextlyKitAssetsConfig $config) {
    if (!isset($config->tpl)) {
      return;
    }

    $parsed = array();
    foreach ($config->tpl as $name => $filepath) {
      $parsed[$name] = $base . $filepath;
    }

    if (!empty($parsed)) {
      $this->tpl += $parsed;
    }
  }

  public function parseConfig(ContextlyKitAssetsConfig $config) {
    $base = '';

    if (!empty($config->base)) {
      $base .= rtrim($config->base, '\/') . '/';
    }

    foreach (array('js', 'css', 'media') as $key) {
      $this->extractAssets($base, $key, $config);
    }

    $this->extractTpl($base, $config);
  }

  function getJs() {
    return array_keys($this->js);
  }

  function getCss() {
    return array_keys($this->css);
  }

  function getTpl() {
    return $this->tpl;
  }

  function getMedia() {
    return array_keys($this->media);
  }

  function buildJsUrls() {
    $js = $this->getJs();
    if (empty($js)) {
      return array();
    }

    $urls = array();
    foreach ($js as $path) {
      $urls[$path] = $this->kit->buildAssetUrl($path . '.js');
    }

    return $urls;
  }

  function buildCssUrls() {
    $css = $this->getCss();
    if (empty($css)) {
      return array();
    }

    $urls = array();
    foreach ($css as $path) {
      $urls[$path] = $this->kit->buildAssetUrl($path . '.css');
    }

    return $urls;
  }

  function buildTplUrls() {
    $tpls = $this->getTpl();
    if (empty($tpls)) {
      return array();
    }

    $urls = array();
    foreach ($tpls as $path) {
      $urls[$path] = $this->kit->buildAssetUrl($path . '.handlebars');
    }

    return $urls;
  }

}

abstract class ContextlyKitAssetsRenderer extends ContextlyKitBase {

  /**
   * @var ContextlyKitAssetsList
   */
  protected $assets;

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitAssetsList $assets
   */
  public function __construct($kit, $assets) {
    parent::__construct($kit);

    $this->assets = $assets;
  }

  abstract public function renderCss();

  abstract public function renderJs();

  abstract public function renderTpl();

  abstract public function renderAll();

}

class ContextlyKitAssetsHtmlRenderer extends ContextlyKitAssetsRenderer {

  public function renderCss() {
    $urls = $this->assets->buildCssUrls();
    if (empty($urls)) {
      return '';
    }

    $output = '<style type="text/css" media="all">' . "\n";
    foreach ($urls as $url) {
      $output .= '@import url("' . $this->kit->escapeHTML($url) . '");';
      $output .= "\n";
    }
    $output .= '</style>';

    return $output;
  }

  public function renderJs() {
    $urls = $this->assets->buildJsUrls();
    if (empty($urls)) {
      return '';
    }

    $output = '';
    foreach ($urls as $url) {
      $output .= '<script type="text/javascript" src="' . $this->kit->escapeHTML($url) . '"></script>';
      $output .= "\n";
    }

    return $output;
  }

  public function renderTpl() {
    $tpl = $this->assets->getTpl();
    if (empty($tpl)) {
      return '';
    }

    if ($this->kit->isDevMode()) {
      $templates = array();
      $basePath = $this->kit->getFolderPath('client', TRUE) . '/';
      foreach ($tpl as $name => $filePath) {
        $fullPath = $basePath . $filePath . '.handlebars';
        $content = file_get_contents($fullPath);
        $templates[$this->kit->escapeHTML($name)] = $content;
      }

      $output = $this->kit->newServerTemplate('handlebars-templates')
        ->render(array(
          'templates' => $templates,
        ));
    }
    else {
      // Templates on the live mode the templates are compiled into JS file.
      $output = '';
    }

    return $output;
  }

  public function renderAll() {
    return implode("\n", array(
      $this->renderCSS(),
      $this->renderJS(),
      $this->renderTpl(),
    ));
  }

}

class ContextlyKitAssetsConfigAggregated extends ContextlyKitBase {

  protected $packageName;

  /**
   * @var \Symfony\Component\Filesystem\Filesystem
   */
  protected $fs;

  protected $config = array();

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitPackageManager $manager
   * @param $packageName
   */
  public function __construct($kit, $manager, $packageName) {
    parent::__construct($kit);

    $this->fs = $manager->getFs();
    $this->packageName = $packageName;
  }

  public function save() {
    $base_path = $this->kit->getFolderPath('config/aggregated', TRUE);
    $target_path = $base_path . '/' . $this->packageName . '.json';

    $folder = dirname($target_path);
    $this->fs->mkdir($folder);

    $json = json_encode($this->config);
    return file_put_contents($target_path, $json);
  }

  public function &__get($name) {
    return $this->config[$name];
  }

  public function __isset($name) {
    return isset($this->config[$name]);
  }

  public function __set($name, $value) {
    $this->config[$name] = $value;
  }

  public function __unset($name) {
    unset($this->config[$name]);
  }

}
