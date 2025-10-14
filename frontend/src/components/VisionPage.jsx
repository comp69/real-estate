import { motion } from 'framer-motion';
import { Eye, Heart, Lightbulb, Leaf, Shield, Zap } from 'lucide-react';
import './VisionPage.css';

const VisionPage = () => {
  const visionPoints = [
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be Pakistan\'s most trusted real estate developer, creating sustainable communities that enhance quality of life for generations to come.'
    },
    {
      icon: Heart,
      title: 'Our Mission',
      description: 'To deliver exceptional living spaces through innovative design, quality construction, and customer-centric service that exceeds expectations.'
    }
  ];

  const commitments = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We integrate eco-friendly practices and green technologies in all our projects to minimize environmental impact and create healthier living spaces.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every project undergoes rigorous quality checks at every stage, ensuring durability, safety, and excellence in construction.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge construction technologies and smart home features to deliver modern, future-ready properties.'
    },
    {
      icon: Zap,
      title: 'Timely Delivery',
      description: 'We pride ourselves on meeting deadlines and delivering projects on time, every time, without compromising on quality.'
    }
  ];

  const futureGoals = [
    'Expand to major cities across Pakistan',
    'Develop 20+ new residential projects by 2030',
    'Achieve 100% sustainable building practices',
    'Create 5,000+ new homes for Pakistani families',
    'Launch smart city initiatives',
    'Establish Pakistan\'s largest green building portfolio'
  ];

  return (
    <div className="vision-page">
      <motion.div 
        className="page-hero vision-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Vision & Mission
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Shaping the future of real estate in Pakistan
          </motion.p>
        </div>
      </motion.div>

      <div className="container">
        {/* Vision & Mission Cards */}
        <section className="vision-mission">
          {visionPoints.map((point, i) => (
            <motion.div
              key={i}
              className="vision-card large"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="vision-icon">
                <point.icon size={48} />
              </div>
              <h2>{point.title}</h2>
              <p>{point.description}</p>
            </motion.div>
          ))}
        </section>

        {/* Commitments */}
        <section className="commitments-section">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Commitments
          </motion.h2>
          <div className="commitments-grid">
            {commitments.map((commitment, i) => (
              <motion.div
                key={i}
                className="commitment-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              >
                <div className="commitment-icon">
                  <commitment.icon size={32} />
                </div>
                <h3>{commitment.title}</h3>
                <p>{commitment.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Future Goals */}
        <section className="future-section">
          <motion.div
            className="future-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Looking Ahead</h2>
            <p className="future-intro">
              As we look to the future, China Group is committed to expanding our 
              reach and impact across Pakistan. Our ambitious goals reflect our 
              dedication to excellence and innovation.
            </p>
            <div className="goals-list">
              {futureGoals.map((goal, i) => (
                <motion.div
                  key={i}
                  className="goal-item"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="goal-number">{i + 1}</div>
                  <p>{goal}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="future-image"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800" alt="Future" />
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section 
          className="vision-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Be Part of Our Vision</h2>
          <p>Join thousands of satisfied customers who have made their dreams come true with China Group</p>
          
        </motion.section>
      </div>
    </div>
  );
};

export default VisionPage;