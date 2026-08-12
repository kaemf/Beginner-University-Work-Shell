<?php
    session_start();
?>

<?php
    $msg='';
    if(isset($_POST['loginBtn'])){

        if(empty($_POST['uname']) || empty($_POST['pass'])) $msg= "Fill the fields";
        else{
            
            $user_name= trim($_POST['uname']);
            $user_password= trim($_POST['pass']);

        $sql= 'SELECT * FROM login WHERE userName=?';
        $queryResult= $Connect->prepare($sql);

        $queryResult->bindParam(1, $user_name);
        
        $queryResult->execute();
        $roww= $queryResult->fetch(PDO::FETCH_ASSOC);
        
        if(($roww['userName']=== $user_name) && 
        password_verify($user_password, $roww['password'])){
            header('Location:dashboard.php');
            $_SESSION['user_name']= $roww['userName'];
        }else $msg='Wrong Username or Password';
        }
    }

?>
