import styles from './About.module.css';
import PageHero from '../../components/PageHero/PageHero';
import Seo from '../../components/Seo/Seo';

const About = () => (
  <>
    <Seo
      title="About"
      description="Learn about Ashu Jainvi — a senior UI developer with 8+ years of experience at DSW and Apple, now focused on photography, graphic design, and AI-powered web projects in Austin, Texas."
      path="/about"
      type="profile"
    />
    <PageHero overline="Get to know" title="About Me">
    <section className={styles.prose}>
      <p>
        Hi, I am <strong>Ashu</strong>. I have been a professional web developer
        for more than <strong>8 years</strong>. My career started in summer 2017
        when I joined <strong>DSW&rsquo;s UI team</strong> as an intern.
      </p>
      <p>
        After completing my master&rsquo;s degree in 2018, I joined DSW
        full-time as a <strong>UI Engineer</strong> &mdash; solving complex
        Angular &amp; web app problems like analytics, accessibility, AB
        testing, performance, and SEO. With the help of my seniors, I pursued
        the goal of mastering Angular under the hood, which shaped my thinking
        towards <em>being a good mentor</em> for peers in similar roles.
      </p>
      <p>
        In 2020, I stepped into a{' '}
        <strong>full-stack (cloud apps) developer</strong> role at DSW &mdash;
        implementing back-end APIs, and designing React.js templates. Working
        across both stacks (Node.js, Express, Docker, CI/CD on the backend;
        Angular &amp; React on the front end) made me realize I feel most
        connected to my mind &amp; soul when{' '}
        <em>creating impactful user experiences</em> and solving complex UI
        challenges.
      </p>
      <p>
        At the end of 2022, I joined <strong>Apple</strong> as a{' '}
        <strong>Senior UI Dev</strong> consultant, where I used my expertise in
        Angular to architect, document, redesign UX (using Sketch), and rewrite
        an Apple-wide enterprise API management web application. I then started
        rewriting &amp; redesigning a Gateway Management app in{' '}
        <strong>React and TypeScript using Vite</strong>.
      </p>
      <p>
        In February 2025, when my contract ended, I took a pause to reflect on
        what brings me joy. I started focusing on integrating{' '}
        <strong>AI tools</strong> into web projects with efficiency in mind, and
        pursued long-lost hobbies like <em>soccer, photography</em>, and{' '}
        <em>digital creativity</em>. I also spent good time with my family in
        India.
      </p>
      <p className={styles.note}>
        <em>
          *Note: No robots were used while generating this content. Pardon any
          human imperfections :)
        </em>
      </p>
    </section>
  </PageHero>
  </>
);

export default About;
