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
      <section className={styles.prose}>
        <p>
          Hey there fellow human, I am{' '}
          <strong className={styles.highlight}>Ashu</strong>. I am professional
          FrontEnd Engineer. My career started as an intern summer 2017 when I
          joined <strong>DSW&rsquo;</strong>.
        </p>
        <p>
          After completing my master&rsquo;s degree in 2018, I joined DSW
          full-time as a <strong>UI Engineer</strong> solving complex web app
          problems like analytics, accessibility, AB testing, performance, and
          SEO.
        </p>
        <p>
          I continued working as a <strong>Senior developer</strong> at DSW till
          2020 end. Working across on the backend &amp; on the front end.
        </p>
        <p>
          At the end of 2022, I joined <strong>Apple</strong> as a{' '}
          <strong>Senior UI Developer</strong> as a consultant, where I used my
          expertise in architecting, documenting, redesigning, and rewriting an
          Apple-wide enterprise API management web platform.
        </p>
        <p>
          In February 2025, when my contract ended, I took a pause to reflect on
          what brings me joy. I started focusing on integrating{' '}
          <strong>AI tools</strong> into web projects with efficiency in mind,
          and pursued long-lost hobbies like <em>soccer, photography</em>, and{' '}
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
