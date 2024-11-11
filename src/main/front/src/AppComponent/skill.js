import React from 'react';
import styled from 'styled-components';
import { FaReact, FaMoon, FaJava } from 'react-icons/fa';
import { SiMui, SiSpring, SiJavascript } from 'react-icons/si';
import { useInView } from 'react-intersection-observer';

// 전체 스킬 컨테이너에 애니메이션 추가
const SkillContainer = styled.div`
    display: flex;
    align-items: center;
    min-height: 60vh;
    padding: 2rem;
    opacity: ${props => (props.$inView ? 1 : 0)}; // opacity = 투명도
    transform: translateY(${props => (props.$inView ? 0 : '50px')}); // translateY = 위치 이동
    transition: all 1s ease-out; // 애니메이션 효과
`;

// TextSection에 애니메이션 추가
const TextSection = styled.div`
    flex: 1;
    padding: 2rem;
    margin-bottom: 10rem;
    position: relative;
    opacity: ${props => (props.$inView ? 1 : 0)};
    transform: translateY(${props => (props.$inView ? 0 : '30px')});
    transition: all 1s ease-out;
    transition-delay: 0.2s;

    h1 {
        font-size: 3.5rem;
        margin: 0;
        padding-left: 5.6rem;
    }

    span {
        font-size: 0.8rem;
        padding-left: 4.5rem;
        position: absolute;
        bottom: 100%;
        left: 5.6rem;
        transform: translateY(1.8rem);
    }
`;

// FeaturesGrid에 애니메이션 추가
const FeaturesGrid = styled.div`
    flex: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 2rem;
    opacity: ${props => (props.$inView ? 1 : 0)};
    transform: translateY(${props => (props.$inView ? 0 : '30px')});
    transition: all 1s ease-out;
    transition-delay: 0.4s;
`;

const FeatureItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
    transition: transform 0.3s ease;
    opacity: ${props => (props.$inView ? 1 : 0)}; // opacity = 투명도
    transform: translateY(${props => (props.$inView ? 0 : '20px')}); // translateY = 위치 이동
    transition: all 0.5s ease-out; // 애니메이션 효과
    transition-delay: ${props => `${props.$index * 0.1}s`}; // 지연 시간

    &:hover {
        transform: translateY(-5px);
    }

    svg {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: ${props => props.theme.iconColor || '#000'}; // iconColor = 아이콘 색상
    }

    h3 {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }

    p {
        font-size: 0.9rem;
        color: ${props => props.theme.secondaryText || '#666'}; // secondaryText = 보조 텍스트 색상
        margin: 0;
    }
`;

function Skill() {
    // ref와 inView 상태를 가져옵니다
    const [ref, inView] = useInView({
        threshold: 0.05,  // 10% 정도 보일 때 트리거
        triggerOnce: true  // 한 번만 트리거
    });

    const features = [
        {
            icon: <FaJava />,
            title: "Java",
            description: "백엔드 개발 언어"
        },
        {
            icon: <SiSpring />,
            title: "Spring Boot",
            description: "JPA, Security 활용"
        },
        {
            icon: <FaReact />,
            title: "React",
            description: "프론트엔드 프레임워크"
        },
        {
            icon: <SiJavascript />,
            title: "JavaScript",
            description: "ES6+ 문법 활용"
        },
        {
            icon: <SiMui />,
            title: "Material-UI",
            description: "UI 컴포넌트 라이브러리"
        },
        {
            icon: <FaMoon />,
            title: "Dark Mode",
            description: "테마 커스터마이징"
        }
    ];

    return (
        <SkillContainer ref={ref} $inView={inView}>
            <TextSection $inView={inView}>
                <span>usage</span>
                <h1>Skill</h1>
            </TextSection>
            <FeaturesGrid $inView={inView}>
                {features.map((feature, index) => (
                    <FeatureItem 
                        key={index} 
                        $inView={inView} 
                        $index={index}
                    >
                        {feature.icon}
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </FeatureItem>
                ))}
            </FeaturesGrid>
        </SkillContainer>
    );
}

export default Skill;