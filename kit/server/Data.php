<?php

class ContextlyKitDataManager extends ContextlyKitBase {

  protected $files;

  protected $versions = FALSE;

  /**
   * @param ContextlyKit $kit
   * @param array $files
   *   Keys are resulting data name, values are full paths to JSON files.
   */
  public function __construct($kit, $files) {
    $this->files = $files;

    parent::__construct($kit);
  }

  protected function parseFile($path) {
    $content = file_get_contents($path);
    $content = json_decode($content, TRUE);
    if ($content === NULL) {
      throw $this->kit->newException('Unable to decode JSON data at ' . $path);
    }

    return $content;
  }

  public function parse() {
    $result = array();

    foreach ($this->files as $name => $path) {
      $result[$name] = $this->parseFile($path);
    }

    if ($this->versions) {
      $result['version'] = $this->getVersions();
    }

    return $result;
  }

  public function addVersions($newValue = TRUE) {
    $this->versions = $newValue;

    return $this;
  }

  protected function getVersions() {
    return array(
      'kit' => $this->kit->version(),
      'cdn' => $this->kit->getCdnVersion(),
    );
  }

  public function compile($escapeHtml = TRUE, $namespace = 'Contextly.data') {
    $output = '';

    foreach ($this->files as $name => $path) {
      $content = $this->parseFile($path);

      $output .= 'd[' . $this->kit->exportJsValue($name, $escapeHtml) . ']=';
      $output .= $this->kit->exportJsValue($content, $escapeHtml) . ';';
    }

    if ($this->versions) {
      $output .= 'd.versions=' . $this->kit->exportJsValue($this->getVersions(), $escapeHtml) . ';';
    }

    if ($output !== '') {
      $output =
        "$namespace=$namespace||{};(function(d){"
        . $output
        . "})($namespace);";
    }

    return $output;
  }

}
