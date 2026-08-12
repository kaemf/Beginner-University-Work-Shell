<?php
    session_start();
?>
<?php
    include('controllers/dbCon.php');
?>

<?php

    $msg='';
    $msg1='';
    if (isset($_POST['resetBtn'])){
        $markId= $_SESSION['user_name'];
        
        if (!empty($_POST['pass1']) && !empty($_POST['pass2'])){

            if ($_POST['pass1'] === $_POST['pass2']){
                
                $newPass= password_hash($_POST['pass1'], PASSWORD_DEFAULT);

                $sql_reset= 'UPDATE login SET password=? WHERE userName=?';
        
                $sql_res= $Connect->prepare($sql_reset);
        
                $sql_res->bindParam(1, $newPass);
                $sql_res->bindParam(2, $markId);
                
                if ($sql_res->execute()) $msg1= "Reset successful, login now";
                else $msg="reset failure";
            }else $msg= "password mismatch!!";
        }else $msg="Please, fill all the fields";
    }

?>

<!DOCTYPE html>
<html lang="en">

    <head class="copied">
        <link rel="stylesheet" type="text/css" href="../assets/css/styles.css">
        <meta charset="UTF-8mb4">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IGOMU BUSINESS ENT.</title>
    </head>

<?php
    include('header.php');
?>

<body>

    <div class="nav">
        <a href="index.php">Home</a>
    </div>

    <div class="formWrap">
        <p id="warning_msg"><?php echo $msg ?></p>
        <p id="success_msg"><?php echo $msg1 ?></p>
        <h1>Password Reset</h1>

        <form action="reset_password.php" method= "post">
        
            <div class= "formInput">
                <input type="password" name="pass1" placeholder="New Password" id="password">
            </div>
            
            <div class= "formInput">
                <input type="password" name="pass2" placeholder="Re-enter password" id="password" autofucus= "autofocus">
            </div>

            <div class="btn">
                <button type= "submit" name="resetBtn">Reset</button>
                <p><a href="login.php">Back-to-Login</a></p>
            </div>

        </form>
    </div> 

</body>
</html>