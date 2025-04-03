<?php

namespace Concrete\Package\SimpleTables;

use Concrete\Core\Package\Package;

class Controller extends Package
{
    protected string $pkgHandle = 'simple_tables';
    protected string $pkgVersion = '0.0.2';
    protected $appVersionRequired = '9.0.0';

    public function getPackageDescription(): string
    {
        return t('Contains Block Type to add tables to your Concrete CMS site.');
    }

    public function getPackageName(): string
    {
        return t('Simple Tables');
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
