<?php

defined("C5_EXECUTE") or die("Access Denied.");

/** @var array $entries */

$entries = $entries ?? [];

?>

<?php if (count($entries) > 0) { ?>
    <table class="table table-bordered">
        <thead>
        <tr>
            <?php foreach ($entries[0] as $value) { ?>
                <th>
                    <?php echo $value["key"] ?? ''; ?>
                </th>
            <?php } ?>
        </tr>
        </thead>

        <tbody>
        <?php foreach ($entries as $entry) { ?>
            <tr>
                <?php foreach ($entry as $value) { ?>
                    <td>
                        <?php echo $value["value"] ?? ''; ?>
                    </td>
                <?php } ?>
            </tr>
        <?php } ?>
        </tbody>
    </table>
<?php } ?>