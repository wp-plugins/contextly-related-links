<?php

class ContextlyKitAssetsManager extends ContextlyKitBase {

  protected $configs = array();

  protected $configsPath;

  public function __construct($kit) {
    parent::__construct($kit);

    $this->configsPath = $this->kit->getFolderPath('config', TRUE);
  }

  /**
   * @param string $packageName
   *
   * @return ContextlyKitAssetsConfig
   */
  public function getConfig($packageName) {
    if (!isset($this->configs[$packageName])) {
      $path = $this->configsPath . '/' . $packageName . '.json';
      $this->configs[$packageName] = $this->kit->newAssetsConfig($packageName, $path);
    }

    return $this->configs[$packageName];
  }

  /**
   * Returns list of configs keyed by package name.
   *
   * Order of packages on the "include" section is kept. Dependencies of each
   * package are included before the package itself.
   *
   * @param string $parentName
   *   Name of the parent package.
   * @param array $ignore
   *   List of ignored packages. Keys are package names, values are not used.
   * @param array $utilized
   *   Internal use only. Stores the list of already found packages, to avoid
   *   parsing of the same package multiple times.
   *
   * @return ContextlyKitAssetsConfig[]
   *   Keys are package names, values are configs on added packages or NULLs on
   *   ignored ones.
   */
  function resolveDependencies($parentName, $ignore = array(), &$utilized = array()) {
    $utilized[$parentName] = TRUE;

    $result = array();
    $config = NULL;
    if (!array_key_exists($parentName, $ignore)) {
      $config = $this->getConfig($parentName);
      if (!empty($config->include)) {
        foreach ($config->include as $package) {
          if (isset($utilized[$package])) {
            continue;
          }

          $result += $this->resolveDependencies($package, $ignore, $utilized);
        }
      }
    }

    $result[$parentName] = $config;

    return $result;
  }

  /**
   * @param ContextlyKitAssetsConfig[] $configs
   * @param array $ignore
   *
   * @return array
   */
  function resolveExposed($configs, $ignore = array()) {
    $ignore += $configs;

    $exposed = array();
    foreach ($configs as $config) {
      if (!isset($config) || empty($config->expose)) {
        continue;
      }

      foreach ($config->expose as $name) {
        $exposed += $this->resolveDependencies($name, $ignore);
      }
    }
    return $exposed;
  }

  /**
   * Adds assets of the specified package to the assets list.
   *
   * @param string $packageName
   * @param ContextlyKitAssetsList $assets
	 * @param array $ignore
	 *   Keys are package names to ignore, values are not used. Should be used
	 *   to replace Kit libraries with CMS variants. Has no effect on exposed
   *   packages, but still affects dependencies of exposed ones.
   *
   * @return array
   *   List of parsed packages, including ignored ones. Keys are package names,
   *   values are TRUE for included packages and FALSE for ignored ones.
   */
  function extractPackageAssets($packageName, $assets, $ignore = array()) {
    $configs = $this->resolveDependencies($packageName, $ignore);

    $result = array();
    foreach ($configs as $key => $config) {
      $included = isset($config);
      $result[$key] = $included;
      if (!$included) {
        continue;
      }

      // Add dependencies.
      $assets->parseConfig($config);
    }

    // Add exposed and their dependencies.
    $exposed = $this->resolveExposed(array_filter($configs), $ignore);
    if (!empty($exposed)) {
      $assets->parseExposed($exposed);
    }

    return $result;
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

}

class ContextlyKitAssetsConfigBase extends ContextlyKitBase {

  protected $config;

  function getExposed() {
    return array_diff_key((array) $this->config, array(
      'aggregate' => TRUE,
      'expose' => TRUE,
      'versions' => TRUE,
      'media' => TRUE,
    ));
  }

}

class ContextlyKitAssetsConfig extends ContextlyKitAssetsConfigBase {

  protected $filepath;

  function __construct($kit, $name, $path) {
    parent::__construct($kit);

    $this->name = $name;
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

  function getName() {
    return $this->name;
  }

  function __isset($name) {
    $this->load();
    return isset($this->config->{$name});
  }

  function __get($name) {
    $this->load();
    return $this->config->{$name};
  }

  function getExposed() {
    $this->load();
    return parent::getExposed();
  }

}

class ContextlyKitAssetsList extends ContextlyKitBase {

  protected $js = array();

  protected $css = array();

  protected $tpl = array();

  protected $data = array();

  protected $media = array();

  protected $exposed = array();

  /**
   * Whether to add Kit & CDN versions to the data.
   *
   * @var bool
   */
  protected $versions = FALSE;

  protected function extractAssets($base, $key, ContextlyKitAssetsConfig $config) {
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

  protected function extractResources($base, $key, $config) {
    if (!isset($config->{$key})) {
      return;
    }

    $parsed = array();
    foreach ($config->{$key} as $name => $filepath) {
      $parsed[$name] = $base . $filepath;
    }

    if (!empty($parsed)) {
      $this->{$key} += $parsed;
    }
  }

  /**
   * @param ContextlyKitAssetsConfigBase[] $configs
   * @param bool $clear
   */
  public function parseExposed($configs, $clear = FALSE) {
    if ($clear) {
      $this->exposed = array();
    }

    foreach ($configs as $name => $config) {
      if (isset($this->exposed[$name])) {
        // Don't do it twice.
        continue;
      }

      $this->exposed[$name] = $config->getExposed();
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

    foreach (array('tpl', 'data') as $key) {
      $this->extractResources($base, $key, $config);
    }

    if (!empty($config->versions)) {
      $this->versions = TRUE;
    }
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

  function getData() {
    return $this->data;
  }

  function getExposed() {
    return $this->exposed;
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

  protected function buildResourcesPaths($key, $extension) {
    if (empty($this->{$key})) {
      return array();
    }

    $paths = array();
    $basePath = $this->kit->getFolderPath('client', TRUE);
    foreach ($this->{$key} as $name => $filePath) {
      $paths[$name] = $basePath . '/' . $filePath . '.' . $extension;
    }
    return $paths;
  }

  function buildTplPaths() {
    return $this->buildResourcesPaths('tpl', 'handlebars');
  }

  function buildDataPaths() {
    return $this->buildResourcesPaths('data', 'json');
  }

  protected function buildData($escapeHtml) {
    return $this->kit->newDataManager($this->buildDataPaths())
      ->addVersions($this->versions)
      ->compile($escapeHtml);
  }

  protected function buildExposedAssets($escapeHtml) {
    $exposed = $this->getExposed();
    if (!empty($exposed)) {
      return $this->kit->newExposedAssetsManager($exposed)
        ->compile($escapeHtml);
    }

    return '';
  }

  public function buildInlineJs($escapeHtml) {
    if ($this->kit->isLiveMode()) {
      // No reasons to build inline JS on live mode, as it's a part of the
      // aggregated JS.
      return '';
    }
    else {
      return $this->buildData($escapeHtml) . $this->buildExposedAssets($escapeHtml);
    }
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

  abstract public function renderInlineJs();

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
      // Templates are compiled into JS file on live mode.
      $output = '';
    }

    return $output;
  }

  public function renderInlineJs() {
    $output = $this->assets->buildInlineJs(TRUE);
    if ($output !== '') {
      $output = '<script type="text/javascript">' . $output . "</script>\n";
    }
    return $output;
  }

  public function renderAll() {
    return implode("\n", array(
      $this->renderCss(),
      $this->renderJs(),
      $this->renderInlineJs(),
      $this->renderTpl(),
    ));
  }

}

class ContextlyKitAssetsConfigAggregated extends ContextlyKitAssetsConfigBase {

  protected $packageName;

  /**
   * @var \Symfony\Component\Filesystem\Filesystem
   */
  protected $fs;

  /**
   * @param ContextlyKit $kit
   * @param ContextlyKitPackageManager $manager
   * @param $packageName
   */
  public function __construct($kit, $manager, $packageName) {
    parent::__construct($kit);

    $this->config = array();
    $this->fs = $manager->getFs();
    $this->packageName = $packageName;
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
