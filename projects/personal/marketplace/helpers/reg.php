<?php
    session_start();
?>

<?php
    include('controllers/dbCon.php');
?>

<?php
    $msg='';
    if (isset($_POST['signupBtn'])){

        if(empty($_POST['fname']) || empty($_POST['lname']) ||
            empty($_POST['uname']) || empty($_POST['mail']) || 
            empty($_POST['pass']) || empty($_POST['cpass'])) $msg= "All fields are required!";
        else{
            
            $firstname= trim($_POST['fname']);
            $lastname= trim($_POST['lname']);
            $username= trim($_POST['uname']);
            $email= trim($_POST['mail']);
            $password= trim(htmlentities($_POST['pass']));
            $comfirm_password= trim($_POST['cpass']);

            if ($password != $comfirm_password) $msg= "Password Mismatch!";
            else{

                $query1= $Connect->prepare('SELECT * FROM login WHERE userName=?');
                $query1->bindParam(1, $username);
                $query1->execute();

                if ($query1->rowCount()>0) $msg='UserName Already Taken';
                else{

                    $query2= $Connect->prepare('SELECT * FROM login WHERE email=?');
                    $query2->bindParam(1, $email);
                    $query2->execute();
        
                    if($query2->rowCount()>0) $msg='Email Already Taken';
                    else{

                        $_SESSION['user_name']= $username;
                        $password= password_hash($password, PASSWORD_DEFAULT);
            
                        $sqlReg= 'INSERT INTO user_reg 
                        (firstName, lastName) VALUES (?, ?)';
            
                        $queryReg= $Connect->prepare($sqlReg);
            
                        $queryReg->bindParam(1, $firstname);
                        $queryReg->bindParam(2, $lastname);
            
            
                        if ($queryReg->execute()){
            
                            $sqlLog= 'INSERT INTO login 
                            (email, userName, password) VALUE (?, ?, ?)';
                            
                            $queryLog= $Connect->prepare($sqlLog);
                            
                            $queryLog->bindParam(1, $email);
                            $queryLog->bindParam(2, $username);
                            $queryLog->bindParam(3, $password);
            
                            $queryLog->execute();
                            
                            header('Location:dashboard.php');

                        }else $msg= "Registered Error!";
                    }
                }
            }
        }
    }
?>