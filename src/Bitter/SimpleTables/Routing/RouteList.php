<?php

namespace Bitter\SimpleTables\Routing;

use Bitter\SimpleTables\API\V1\Middleware\FractalNegotiatorMiddleware;
use Bitter\SimpleTables\API\V1\Configurator;
use Concrete\Core\Routing\RouteListInterface;
use Concrete\Core\Routing\Router;

class RouteList implements RouteListInterface
{
    public function loadRoutes(Router $router)
    {
        $router
            ->buildGroup()
            ->setNamespace('Concrete\Package\SimpleTables\Controller\Dialog\Support')
            ->setPrefix('/ccm/system/dialogs/simple_tables')
            ->routes('dialogs/support.php', 'simple_tables');
    }
}