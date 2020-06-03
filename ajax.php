<?php 

	print_r($_POST);

	//Buscar Cliente
    if($_POST['action'] == 'searchCliente')
    {
    	if(!emty($_POST['cliente'])){
    		$nit = $_POST['cliente'];
    		$query = mysqli_query($conection,"SELECT * FROM cliente WHERE nit LIKE '$nit' and estatus = 1 ");
    		mysql_close($conection);
    		$result = mysqli_num_rows($query);

    		$data = '';
    		if($result > 0){
    			$data = mysqli_fetch_assoc($query);
    		}else{
    			$data = 0;
    		}
    		echo json_encode($data,JSON_UNESCAPED_UNICODE);
    	}
    	exit;
    }

    //Registrar Cliente_ventas.
    if($_POST['action'] == 'searchCliente'){
    	$nit = $_POST['nit_cliente'];
    	$nombre = $_POST['nom_cliente'];
    	$telefono = $_POST['tel_cliente'];
    	$direccion = $_POST['dir_cliente'];
    	$usuario_id = $_SESSION['idUser'];

    	$query_insert = mysqli_query($conection,"INSERT INTO cliente(nit,nombre,telefono,direccion,usuario_id)
    		                                     VALUES('$nit','$nombre','$telefono','$direccion','$usuario_id')");
    	if($query_insert){
    		$codCliente = mysqli_insert_id($conection);
    		$msg = $codCliente;
    	}else{
    		$msg = 'error';
    	}
    	mysql_close($conection);
    	echo $msg;
    	exit;
    }

	exit;

 ?>