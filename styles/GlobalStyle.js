import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
body.dark-mode {
  --img: invert(1);
  --avatar-shadow: rgba(28,22,47,.3);
}

body.light-mode {
  --img: invert(0);
  --avatar-shadow: rgba(48,52,77,.1);
} 

* {
  --bg-light-yellow: #F2F2EE;
  --bg-light-blue: #EDF2FF;
  --bg-light-red: #F2EEEE;
  
  --light-yellow: #FFF6C5;
  --yellow: #F8C231;
    
  --light-red: #FFC5EC;
  --red: #FF6969;
  --pink: #ED81FF;
  --light-pink: #FFE9FA;
  
  --blue: #00A3FF;
  --light-blue: #B7F2FF;
  
  --white: #FFFFFF;
  --white20: #ecedee;
  --black: #11181C;
  --light-gray: #858585;
  --gray: #687076;
  --light-black: rgba(0,0,0,.05);
  --light-white: rgba(255,255,255,.03);
  
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
  line-height: normal;
  transition: all .1s ease;
  
  
}

html{
    scroll-behavior: smooth;
}
body {
  font-family: 'Inter', sans-serif;
  background: ${({ theme }) => theme.bg.primary};
  color: ${({ theme }) => theme.text.primary};
  text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;

}

a{
  color: ${({ theme }) => theme.text.primary};
}

.main{
    min-height: 100vh;
    
}
.toast-container {
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}
.container{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
}

.nft-clipped{
  clip-path: url(#hex);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.oval-clipped{
  clip-path: url(#oval);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

   
`;

export default GlobalStyle;