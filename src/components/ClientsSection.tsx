import { Card, CardContent } from '@/components/ui/card';
import vibrad from '@/assets/favicon_logo/vibrad.jpeg'
import rusep from '@/assets/favicon_logo/rusep.png';
import match from '@/assets/favicon_logo/match.jpeg';

const clients = [
  {
    name: "Vibrad Languages",
    logo: vibrad,
    industry: "Language Services (Translation & Interpretation)"
  },
  {
    name: "Rural-Urban Social Empowerment Program (RUSEP)",
    logo: rusep,
    industry: "Nonprofit/Educational NGOs"
  },
  {
    name: "Match Electricals Ltd",
    logo: match,
    industry: "Electro‑Mechanical Contractors and Suppliers"
  }
//   {
//     name: "East African Breweries",
//     logo: "https://images.unsplash.com/photo-1586769852044-692d6df3490f?w=200&h=100&fit=crop&crop=center",
//     industry: "Manufacturing"
//   },
//   {
//     name: "Kenya Airways",
//     logo: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=200&h=100&fit=crop&crop=center",
//     industry: "Aviation"
//   },
//   {
//     name: "Nairobi Securities Exchange",
//     logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=100&fit=crop&crop=center",
//     industry: "Financial Services"
//   }
];

const ClientsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've helped secure critical infrastructure and sensitive data for Kenya's most trusted institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client, index) => (
            <Card key={index} className="border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="h-16 w-32 object-contain mx-auto rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {client.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {client.industry}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Ready to join our list of satisfied clients?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Organizations Secured</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;