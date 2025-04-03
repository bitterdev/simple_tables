<?php

defined("C5_EXECUTE") or die("Access Denied.");

/** @var array $entries */

$entries = $entries ?? [];

echo '<table class="table table-bordered">';
echo '<thead>';
echo '<tr>';

if (count($entries) > 0) {
    foreach ($entries[0] as $key => $value) {
        echo '<th>' . htmlspecialchars($key) . '</th>';
    }
}
echo '</tr>';
echo '</thead>';
echo '<tbody>';

foreach ($entries as $entry) {
    echo '<tr>';
    foreach ($entry as $value) {
        echo '<td>' . htmlspecialchars($value) . '</td>';
    }
    echo '</tr>';
}

echo '</tbody>';
echo '</table>';