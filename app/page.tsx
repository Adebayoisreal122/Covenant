import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DailyDevotions from "@/components/DailyDevotions";
import UpcomingPrograms from "@/components/UpcomingPrograms";
import MomentsCaptured from "@/components/MomentsCaptured";
import Testimonies from "@/components/Testimonies";
import PrayerRequests from "@/components/PrayerRequests";
import Registration from "@/components/Registration";
import SocialFollow from "@/components/SocialFollow";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DailyDevotions />
      <UpcomingPrograms />
      <MomentsCaptured />
      <Testimonies />
      <PrayerRequests />
      <Registration />
      <SocialFollow />
      <Contact />
      <Footer />
    </main>
  );
}
