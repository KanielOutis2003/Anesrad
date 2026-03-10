import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (email === "admin@anesrad.com" && password === "admin123") {

        localStorage.setItem("isAuthenticated", "true");

        toast.success("Welcome back Admin 👋");

        navigate("/");

      } else {
        throw new Error("Invalid credentials");
      }

    } catch (err) {

      toast.error(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* Background Image */}
      <img
        src="/hotel-image.jpg"
        alt="Hotel"
        className="bg-image"
      />

      {/* Glass Card */}
      <div className="login-card">

        <div className="login-header">

          <img
            src="/favicon.jpg"
            alt="logo"
            className="logo"
          />

          <h1>ANESRAD INN</h1>
          <p>Hotel Management Dashboard</p>

        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label><Mail size={16}/> Email</label>
            <input
              type="email"
              placeholder="admin@anesrad.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label><Lock size={16}/> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading ? "Logging in..." :
            <>
              Sign In <ChevronRight size={18}/>
            </>}

          </button>

        </form>

        <div className="login-footer">
          <p>Hotel Admin Panel</p>
        </div>

      </div>

<style>{`

.login-container{
height:100vh;
width:100%;
display:flex;
align-items:center;
justify-content:center;
position:relative;
overflow:hidden;
font-family:Inter,sans-serif;
}

/* background image */

.bg-image{
position:absolute;
height:100%;
width:100%;
object-fit:cover;
filter:brightness(0.6);
}

/* glass card */

.login-card{
position:relative;
width:400px;
padding:40px;
border-radius:20px;

background:rgba(255,255,255,0.15);
backdrop-filter:blur(15px);
-webkit-backdrop-filter:blur(15px);

border:1px solid rgba(255,255,255,0.3);

box-shadow:0 8px 32px rgba(0,0,0,0.25);

color:white;
text-align:center;
}

/* header */

.login-header{
margin-bottom:30px;
}

.logo{
width:60px;
height:60px;
border-radius:12px;
margin-bottom:10px;
}

.login-header h1{
font-size:26px;
font-weight:800;
letter-spacing:1px;
}

.login-header p{
font-size:14px;
opacity:.8;
}

/* form */

.login-form{
display:flex;
flex-direction:column;
gap:18px;
}

/* input */

.input-group{
display:flex;
flex-direction:column;
text-align:left;
gap:6px;
}

.input-group label{
font-size:13px;
display:flex;
align-items:center;
gap:6px;
opacity:.9;
}

.input-group input{

padding:12px 14px;

border-radius:10px;
border:none;

background:rgba(255,255,255,0.25);

color:white;
font-size:14px;

outline:none;

backdrop-filter:blur(10px);

}

.input-group input::placeholder{
color:rgba(255,255,255,0.7);
}

/* button */

.login-btn{

margin-top:10px;

padding:14px;

border:none;

border-radius:12px;

background:white;
color:black;

font-weight:700;
font-size:15px;

display:flex;
align-items:center;
justify-content:center;
gap:8px;

cursor:pointer;

transition:.3s;

}

.login-btn:hover{

transform:translateY(-2px);

box-shadow:0 8px 20px rgba(0,0,0,0.3);

}

/* footer */

.login-footer{
margin-top:20px;
font-size:12px;
opacity:.8;
}

`}</style>

    </div>
  );
};

export default Login;
