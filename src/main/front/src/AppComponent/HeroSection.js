import React from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';

const HeroContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  color: white;
`;

const TextSection = styled.div`
  flex: 1;
  padding: 2rem;
  
  h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    // 더 부드러운 그라데이션으로 변경
    background: linear-gradient(45deg, #64b5f6, #81c784);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h2 {
    font-size: 1.5rem;
    color: #78909c;  // 더 부드러운 회색
    margin-bottom: 2rem;
  }
`;

const AnimationSection = styled.div`
  flex: 1;
  height: 500px;
`;

function Box() {
    // 텍스처 URL을 여기에 추가 (예: 기하학적 패턴)
    const texture = useTexture('https://www.shutterstock.com/shutterstock/photos/2203210555/display_1500/stock-photo-luxurious-blue-marble-texture-background-panoramic-marbling-texture-design-for-banner-invitation-2203210555.jpg');
    
    return (
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          map={texture}
          color="#e3f2fd"  // 매우 밝은 파란색
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
          <h1>Welcome to MyPage</h1>
          <h2>A place where innovation meets creativity</h2>
        </TextSection>
        <AnimationSection>
          <Canvas>
            <ambientLight intensity={0.7} />  // 조명 강도 증가
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Box />
            <OrbitControls 
              enableZoom={false}  // 줌 비활성화
              autoRotate  // 자동 회전 추가
              autoRotateSpeed={4}  // 회전 속도
            />
          </Canvas>
        </AnimationSection>
      </HeroContainer>
    );
  }

export default HeroSection;