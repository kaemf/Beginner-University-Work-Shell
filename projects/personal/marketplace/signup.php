<?php
    include('helpers/reg.php');
?>

<!DOCTYPE html>
<html lang="en">

<?php
    include('header.php');
?>

<body>

    <div class="nav">
        <a href="login.php">LogIn</a>
        <a href="index.php">Home</a>
    </div>

    <div class="formWrap">
        <p id="warning_msg"><?php echo $msg ?></p>

        <h1>SignUp</h1>

        <form action="signup.php" method="post">
        
            <div id="formInput">
                <input type="text" name="fname" placeholder="Enter first name" id="name" autofucus="autofocus">
            </div>

            <div id="formInput" id="regInput">
                <input type="text" name="lname" placeholder="Enter last name">
            </div>

            <div id="formInput">
                <input type="text" name="uname" placeholder="Enter username" id="name">
            </div>
            
            <div id="formInput">
                <input type="email" name="mail" placeholder="Enter email" id="mail">
            </div>

            <div id="formInput">
                <input type="password" name="pass" placeholder="Enter password" id="password">
            </div>

            <div id="formInput">
                <input type="password" name="cpass" placeholder="Comfirm password" id="cpassword">
            </div>

            <div class="btn">
                <button type="submit" name="signupBtn">SignUp</button>
            </div>

        </form>
        <p>Register already? <a href="login.php"> LogIn</a></p> 
    </div> 

</body>
</html>