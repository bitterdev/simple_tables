<?php

namespace Concrete\Package\SimpleTables;

use Bitter\SimpleTables\Provider\ServiceProvider;
use Concrete\Core\Package\Package;

class Controller extends Package
{
    protected string $pkgHandle = 'simple_tables';
    protected string $pkgVersion = '0.0.2';
    protected $appVersionRequired = '9.0.0';
    protected $pkgAutoloaderRegistries = [
        'src/Bitter/SimpleTables' => 'Bitter\SimpleTables',
        ];

    public function getPackageDescription(): string
    {
        return t('Simple Tables is a Concrete CMS add-on for creating responsive tables with an Excel-like editor—fast, simple, and code-free.');
    }

    public function getPackageName(): string
    {
        return t('Simple Tables');
    }
    public function on_start()
    {
        /** @var ServiceProvider $serviceProvider */
        /** @noinspection PhpUnhandledExceptionInspection */
        $serviceProvider = $this->app->make(ServiceProvider::class);
        $serviceProvider->register();
    }

    public function install(): \Concrete\Core\Entity\Package
    {
        $pkg = parent::install();
        $this->installContentFile("data.xml");
        return $pkg;
    }

    public function upgrade()
    {
        parent::upgrade();
        $this->installContentFile("data.xml");
    }
}
