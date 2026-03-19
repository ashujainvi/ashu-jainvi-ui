import styles from './About.module.css';
import PageHero from '../../components/PageHero/PageHero';
import Seo from '../../components/Seo/Seo';

const About = () => (
  <>
    <Seo
      title="About"
      description="Learn about Ashu Jainvi — a senior engineer with 8+ years of experience at DSW and Apple, focused on photography, graphic design, and AI-powered web projects in Austin, Texas."
      path="/about"
      type="profile"
    />
    <PageHero overline="Get to know" title="About Me">
      <section className="prose">
        <p>
          Hey there fellow human, I am <strong>Ashu</strong>. I am professional
          FrontEnd Engineer, photographer and a soccer ethusiast from Austin,
          TX.
        </p>
        <p>
          After finishing my M.S in Computer Science from University at Buffalo
          in 2018, I worked at DSW as a <strong>UI Engineer</strong> solving
          complex web problems like analytics, accessibility, AB testing,
          performance, and SEO.
        </p>
        <p>
          At the end of 2022, I consulted at <strong>Apple</strong> as a{' '}
          <strong>Senior UI Developer</strong>, where I used my expertise in
          redesigning, rewriting, architecting, and documenting enterprise level
          API management web platform.
        </p>
        <p>
          In February 2025, I took a pause to reflect on what brings me joy. I
          rekindled my love for family, community, photography and soccer
          full-time. After spending time with my family and friends, I started a
          new chapter of portrait photography and AI-assisted web development,
          which motived my to start focusing on integrating{' '}
          <strong>AI tools</strong> into web projects with efficiency in mind. I
          am passionate about creating innovative solutions that leverage the
          power of AI to enhance user experiences and drive business growth.
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
