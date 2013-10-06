<?php


include 'app.php';


if ('GET' === $_SERVER['REQUEST_METHOD'])
{
    echo json_encode(getLocs());
}
else if ('POST' === $_SERVER['REQUEST_METHOD'])
{
    echo 'Sent report';
    putLoc($_POST['lat'], $_POST['lon']);
}


?>

