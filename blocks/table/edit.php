<?php

defined("C5_EXECUTE") or die("Access Denied.");

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;

/** @var array $entries */

$entries = $entries ?? [];

$app = Application::getFacadeApplication();
/** @var Form $form */
/** @noinspection PhpUnhandledExceptionInspection */
$form = $app->make(Form::class);

echo $form->hidden("entries", json_encode($entries));

?>

<div id="myTableEditor"></div>

<script>
    $(document).ready(function () {
        $("#myTableEditor").createTableEditor(<?php echo json_encode([
            "addColumnText" => t("Add Column"),
            "removeColumnText" => t("Remove Column"),
            "addRowText" => t("Add Row"),
            "noDataAvailable" => t("No data available"),
            "selectColumnText" => t("-- Select Column --"),
            "alertInvalidJson" => t("Invalid JSON format!"),
            "alertSelectColumn" => t("Please select a column!"),
            "data" => $entries
        ]);?>);
    });
</script>