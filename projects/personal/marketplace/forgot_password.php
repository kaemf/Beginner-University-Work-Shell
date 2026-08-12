<?php
    include('controllers/dbCon.php');
?>

<?php
    include('helpers/log.php');
?>

<!DOCTYPE html>
<html lang="en">

<?php
    include('header.php');
?>

<?php
    $msg='';
    if (isset($_POST['recoveryBtn'])){

        if (!empty($_POST['uname']) && !empty($_POST['mail'])){

            $username_verify= trim($_POST['uname']);
            $email_verify= trim($_POST['mail']);

            $sql_ver= $Connect->prepare('SELECT * FROM login WHERE userName=?');
            $sql_ver->bindParam(1, $username_verify);
            
            $sql_ver->execute();
            $row= $sql_ver->fetch(PDO::FETCH_ASSOC);

            if (($row['userName']!= $username_verify) && ($row['email']!= $email_verify)) $msg= 'Invalid credentials';
            else{
                $_SESSION['user_name']= $username_verify;
                header('location:reset_password.php'); 
            }

        }else $msg= 'All fields are required';
    }
    ?>
<body>

    <div class="formWrap">
        <p id="warning_msg"><?php echo $msg ?></p>
        <h1>Account Recovery</h1>
        <p style="color:blue;">Enter Account Username and Email to verify ownership</p>

        <form action="forgot_password.php" method= "post">
    
            <div id="formInput">
                <input type="text" name="uname" placeholder="Username" id="name" autofucus="autofocus">
            </div>

            <div id="formInput">
                <input type="text" name="mail" placeholder="Email" id="email">
            </div>
        
            <div class="btn">
                <button type="submit" name="recoveryBtn">Verify</button>
            </div>

        </form>
    </div> 

</body>
</html>