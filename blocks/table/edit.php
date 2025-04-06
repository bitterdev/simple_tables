<?php

defined("C5_EXECUTE") or die("Access Denied.");

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Identifier;
use Concrete\Core\View\View;

/** @var array $entries */

$entries = $entries ?? [];

$app = Application::getFacadeApplication();
/** @var Form $form */
/** @noinspection PhpUnhandledExceptionInspection */
$form = $app->make(Form::class);
/** @noinspection PhpUnhandledExceptionInspection */
/** @var Identifier $idHelper */
$idHelper = $app->make(Identifier::class);

$id = "ccm-" . $idHelper->getString();

echo $form->hidden("entries", json_encode($entries));

/** @noinspection PhpUnhandledExceptionInspection */
View::element("dashboard/help_blocktypes", [], "simple_tables");
?>

<p class="alert alert-info">
    <?php echo t("Right-click on a row or column to open the context menu. From there, you can add, edit, move, or delete rows or columns."); ?>
</p>

<div id="<?php echo $id; ?>"></div>

<script>
    $(document).ready(function () {
        $("#<?php echo $id; ?>").createTableEditor(<?php echo json_encode([
            "empty" => t("Empty"),
            "renameColumnText" => t("Rename Column"),
            "addColumnLeftText" => t("Add Column Left"),
            "addColumnRightText" => t("Add Column Right"),
            "moveColumnLeftText" => t("Move Column Left"),
            "moveColumnRightText" => t("Move Column Right"),
            "deleteColumnText" => t("Delete Column"),
            "insertRowAboveText" => t("Insert Row Above"),
            "insertRowBelowText" => t("Insert Row Below"),
            "insertMultipleRowsAboveText" => t("Insert Multiple Rows Above"),
            "insertMultipleRowsBelowText" => t("Insert Multiple Rows Below"),
            "moveRowUpText" => t("Move Row Up"),
            "moveRowDownText" => t("Move Row Down"),
            "deleteRowText" => t("Delete Row"),
            "promptColumnNameText" => t("Enter column name:"),
            "promptRenameText" => t("New column name:"),
            "promptRowsText" => t("How many rows to insert?"),
            "confirmDeleteColumnText" => t("Delete this column?"),
            "confirmDeleteRowText" => t("Delete this row?"),
            "invalidNumberText" => t("Please enter a valid positive number."),
            "data" => $entries
        ]); ?>);
    });
</script>