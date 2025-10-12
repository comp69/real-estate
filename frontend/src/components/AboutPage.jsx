import { motion } from 'framer-motion';
import { Award, Users, Target, TrendingUp } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in construction quality and customer service'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction and trust are the foundation of our business'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We embrace modern construction techniques and sustainable practices'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Continuously expanding to serve more communities across Pakistan'
    }
  ];

  const milestones = [
    { year: '1998', title: 'Company Founded', desc: 'Started with a vision to transform real estate' },
    { year: '2005', title: 'First Major Project', desc: 'Completed our landmark residential complex' },
    { year: '2015', title: 'Expanded Portfolio', desc: 'Diversified into commercial developments' },
    { year: '2025', title: '2000+ Happy Families', desc: 'Delivered homes to thousands of families' }
  ];

  return (
    <div className="about-page">
      <motion.div 
        className="page-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About China Group
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Building trust, delivering quality since 1998
          </motion.p>
        </div>
      </motion.div>

      <div className="container">
        {/* Story Section */}
        <section className="about-story">
          <motion.div 
            className="story-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Story</h2>
            <p>
              For over 25 years, China Group has been at the forefront of Pakistan's real estate 
              development. What started as a small construction company has grown into one of 
              Karachi's most trusted names in residential and commercial property development.
            </p>
            <p>
              We've successfully delivered over 50 projects, housing more than 2,000 families 
              and creating spaces where businesses thrive. Our commitment to quality, timely 
              delivery, and customer satisfaction has earned us the trust of thousands.
            </p>
            <p>
              Every project we undertake is a testament to our dedication to excellence. 
              From concept to completion, we ensure that every detail meets the highest 
              standards of quality and craftsmanship.
            </p>
          </motion.div>
          <motion.div 
            className="story-image"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" alt="Buildings" />
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <div className="values-grid">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="value-icon">
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="about-timeline">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.h2>
          <div className="timeline">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                className="timeline-item"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <motion.div
            className="team-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Team</h2>
            <p>
              Behind every successful project is a dedicated team of professionals. 
              Our architects, engineers, project managers, and support staff work 
              tirelessly to ensure your dream home becomes a reality.
            </p>
            <p>
              With decades of combined experience, our team brings expertise, 
              innovation, and a personal touch to every project we undertake.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;