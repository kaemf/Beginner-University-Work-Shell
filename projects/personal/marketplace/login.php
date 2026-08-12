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

<body>

    <div class="nav">
        <a href="signup.php">SignUp</a>
        <a href="index.php">Home</a>
    </div>

    <div class="formWrap">
        <p id="warning_msg"><?php echo $msg ?></p>

        <h1>SignIn</h1>
        <form action="login.php" method= "post">
        
            <div class="formInput">
                <input type="text" name= "uname" placeholder="Enter username" id="name" autofucus="autofocus">
            </div>
            
            <div class="formInput">
                <input type="password" name="pass" placeholder="Enter password" id="password">
            </div>
        
            <div class="btn">
                <button type= "submit" name="loginBtn">LOGIN</button>
            </div>

        </form>
        <p>Not register yet? <a href="signup.php"> SignUp</a></p> 
        <p><a href="forgot_password.php"> Forgot Password</a></p> 
    </div> 
</body>
</html>