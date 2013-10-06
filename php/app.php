<?php


include 'db_credentials.php';
date_default_timezone_set('UTC');
ini_set("log_errors", 1);


function getLocs()
{
	/*$db = new PDO('mysql:host='.HOST.';dbname='.DBNAME, USERNAME, PASSWORD);
	$statement = $db->prepare('SELECT * FROM `log`');
	$statement->execute();
	error_log(print_r($statement->errorInfo(), true));
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);*/
	$result = array( //temporary
        array('id' => '1','device_id' => NULL,'log_entry' => '2013-10-06 01:42:09','lat' => '33.7744','lon' => '-84.3966'),
        array('id' => '2','device_id' => NULL,'log_entry' => '2013-10-06 02:02:14','lat' => '33.7744','lon' => '-84.3964'),
        array('id' => '3','device_id' => NULL,'log_entry' => '2013-10-06 02:22:16','lat' => '33.7744','lon' => '-84.3962'),
        array('id' => '4','device_id' => NULL,'log_entry' => '2013-10-06 02:42:18','lat' => '33.7744','lon' => '-84.3960')
    );
    
    //Add time since reported (up to 2 hours) as int 0-9
    $time = time();
    foreach ($result as $key => &$value) 
    {
        $timediff = $time - strtotime($value['log_entry']);
        //Ignore reports over 2 hours
        if ($timediff/3600 > 2) {
            unset($result[$key]);
            continue;
        }
        //Interpolate over ints 0-9
        $value['timeago'] = floor(9 * ($timediff/3600)/2);
    }
	return $result;
}


function putLoc($lat, $lon)
{
    try 
    {
        $db = new PDO(
            'mysql:host='.HOST.';dbname='.DBNAME, 
            USERNAME, 
            PASSWORD,
            array
            (
                PDO::ATTR_EMULATE_PREPARES => false, 
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            )
        );
    } 
    catch(PDOException $e) 
    {
        error_log('ERROR: '.$e->getMessage());
        return;
    }
    
    $statement = $db->prepare('INSERT INTO `log` (`lat`,`lon`) VALUES (:lat, :lon)');
    $statement->bindParam(':lat', $lat);
    $statement->bindParam(':lon', $lon);
    $statement->execute();
    error_log(print_r($statement->errorInfo(), true));
    $result = $db->lastInsertId();
    return $result;
}


?>

