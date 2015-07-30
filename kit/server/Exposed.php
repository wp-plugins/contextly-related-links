<?php

class ContextlyKitExposedAssetsManager extends ContextlyKitBase {

  protected $names = array();

  /**
   * @var array
   */
  protected $exposed = array();

  public function __construct($kit, $exposed) {
    $this->exposed = $exposed;

    parent::__construct($kit);
  }

  public function compile($escapeHtml = TRUE, $namespace = 'Contextly.assets') {
    if (empty($this->exposed)) {
      return '';
    }

    $output = "$namespace=$namespace||{};(function(a){";
    foreach ($this->exposed as $name => $content) {
      $output .= 'a[' . $this->kit->exportJsValue($name, $escapeHtml) . ']=';
      $output .= $this->kit->exportJsValue($content, $escapeHtml) . ';';
    }
    $output .= "})($namespace);";

    return $output;
  }

}
