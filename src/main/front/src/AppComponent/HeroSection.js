import React from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { FaJava, FaReact } from 'react-icons/fa';
import { SiSpring, SiJavascript } from 'react-icons/si';

const HeroContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
`;

const TextSection = styled.div`
  flex: 1;
  padding: 8rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    background: ${props => props.theme.gradientText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h2 {
    font-size: 1.5rem;
    color: ${props => props.theme.secondaryText};
    margin-bottom: 2rem;
  }
`;

const AnimationSection = styled.div`
  flex: 1;
  height: 500px;
`;

const TechStack = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  
  svg {
    width: 40px;
    height: 40px;
    color: ${props => props.theme.iconColor};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.hoverColor};
    }
  }
`;

function Box() {
    const texture = useTexture('https://www.shutterstock.com/shutterstock/photos/2203210555/display_1500/stock-photo-luxurious-blue-marble-texture-background-panoramic-marbling-texture-design-for-banner-invitation-2203210555.jpg');
    
    return (
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          map={texture}
          color="#e3f2fd"
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
    );
}

function HeroSection() {
    return (
      <HeroContainer>
        <TextSection>
          <h1>홈페이지에 오신걸 환영합니다.</h1>
          <TechStack>
            <FaJava title="Java" />
            <SiJavascript title="JavaScript" />
            <FaReact title="React" />
            <SiSpring title="Spring" />
          </TechStack>
        </TextSection>
        <AnimationSection>
          <Canvas>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Box />
            <OrbitControls 
              enableZoom={false}
              autoRotate
              autoRotateSpeed={4}
            />
          </Canvas>
        </AnimationSection>
      </HeroContainer>
    );
}

export default HeroSection;