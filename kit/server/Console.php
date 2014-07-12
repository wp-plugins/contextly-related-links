<?php

use \Symfony\Component\Console\Command\Command;
use \Symfony\Component\Console\Input\InputInterface;
use \Symfony\Component\Console\Input\InputArgument;
use \Symfony\Component\Console\Input\InputOption;
use \Symfony\Component\Console\Output\OutputInterface;

class ContextlyKitConsolePackagerCommand extends Command {

  /**
   * @var ContextlyKitPackageManager
   */
  protected $manager;

  public function __construct($manager) {
    parent::__construct();

    $this->manager = $manager;
  }

  protected function configure() {
    $this
      ->setName('run')
      ->setDescription('Perform packaging operations on the Kit.')
      ->addArgument(
        'operations',
        InputArgument::IS_ARRAY,
        'Space-separated list of operations: "aggregate-assets", "upload-assets", "build-archives", "upload-archives". Default to perform all of them. Input order is not important.'
      )
      ->addOption(
        'override',
        NULL,
        InputOption::VALUE_NONE,
        'Specify to override existing remote assets and local/remote archives. By default only local aggregated assets are overwritten.'
      )
      ->addOption(
        'build',
        NULL,
        InputOption::VALUE_REQUIRED,
        'Version of the Kit to build.',
        'dev'
      );
  }

  protected function execute(InputInterface $input, OutputInterface $output) {
    $map = array(
      "aggregate-assets" => array(
        'aggregateAssets',
        array('version'),
      ),
      "upload-assets" => array(
        'uploadAssets',
        array('version', 'override'),
      ),
      "build-archives" => array(
        'buildArchives',
        array('version', 'override'),
      ),
      "upload-archives" => array(
        'uploadArchives',
        array('version', 'override'),
      ),
    );

    $operations = $input->getArgument('operations');
    if (empty($operations)) {
      $operations = array_keys($map);
    }

    $args_values = array(
      'override' => (bool) $input->getOption('override'),
      'version' => $input->getOption('build'),
    );

    foreach (array_intersect(array_keys($map), $operations) as $operation) {
      list($func, $args_order) = $map[$operation];

      $args = array();
      foreach ($args_order as $key) {
        $args[] = $args_values[$key];
      }

      call_user_func_array(array($this->manager, $func), $args);
    }
  }

}
