<?php

namespace Concrete\Package\SimpleTables\Block\Table;

use Concrete\Core\Block\BlockController;

class Controller extends BlockController
{
    protected $btTable = 'btTable';
    protected $btInterfaceWidth = 400;
    protected $btInterfaceHeight = 500;
    protected $btCacheBlockOutputLifetime = 300;

    public function getBlockTypeDescription(): string
    {
        return t("Add a table to your site.");
    }

    public function getBlockTypeName(): string
    {
        return t("Table");
    }

    public function add()
    {
        $this->setDefaults();
    }

    public function edit()
    {
        $this->setDefaults();
    }

    public function view()
    {
        $this->setDefaults();
    }

    public function setDefaults()
    {
        if (is_string($this->get('entries')) && strlen($this->get('entries')) > 0) {
            $this->set('entries', json_decode($this->get('entries'), true));
        }
    }
}