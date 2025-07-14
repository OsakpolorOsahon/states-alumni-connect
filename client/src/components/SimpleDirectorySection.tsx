import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';

const SimpleDirectorySection = () => {
  const { stats, loading } = useRealTimeStats();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Member Directory</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow Statesmen from across the globe. Our network spans multiple generations of leadership and excellence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Users className="h-12 w-12 text-[#E10600] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {loading ? "..." : (stats.activeMembers || "0")}
              </h3>
              <p className="text-muted-foreground">Active Members</p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Users className="h-12 w-12 text-[#E10600] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {loading ? "..." : (stats.totalMembers || "0")}
              </h3>
              <p className="text-muted-foreground">Total Members</p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Users className="h-12 w-12 text-[#E10600] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {loading ? "..." : (stats.hallOfFameCount || "0")}
              </h3>
              <p className="text-muted-foreground">Hall of Fame</p>
            </div>
          </div>

          <Button asChild size="lg" className="bg-[#E10600] hover:bg-[#C10500]">
            <Link to="/directory">
              Explore Directory
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default SimpleDirectorySection;