import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from './DarkMode/ThemeContext';
import { lightTheme, darkTheme } from './DarkMode/theme';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import HeroSection from './AppComponent/HeroSection';
import Skill from './AppComponent/skill';
import PageHits from './AppComponent/PageHits';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
    margin: 0;
    padding: 0;
  }
`;

function App() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/Admin');
  const isHomePage = location.pathname === '/';

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {!isAdminPage && <Header />}
      {isHomePage && <HeroSection />}
      {isHomePage && <PageHits />}
      {isHomePage && <Skill />}
      <Main />
      {!isAdminPage && <Footer />}
    </StyledThemeProvider>
  );
}

export default App;
