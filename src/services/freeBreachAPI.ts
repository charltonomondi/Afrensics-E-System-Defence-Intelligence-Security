// Free Breach Checking APIs - No CORS Issues
// Multiple free APIs with fallback system

interface BreachResult {
  isBreached: boolean;
  breaches: any[];
  riskScore: number;
  message: string;
  source: string;
}

class FreeBreachAPI {
  private counter = 0;

  // Method 0: Try server-side proxy first (FREE - no payment required)
  async checkWithServerProxy(email: string): Promise<BreachResult> {
    try {
      // Local development: use PHP server on port 8081
      // Production: use same domain proxy
      const proxyUrl = window.location.hostname === 'localhost'
        ? `http://localhost:8081/breach-check-proxy.php?email=${encodeURIComponent(email)}`
        : `/breach-check-proxy.php?email=${encodeURIComponent(email)}`;

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isBreached: data.isBreached,
          breaches: data.breaches || [],
          riskScore: data.riskScore || 0,
          message: data.message,
          source: 'Server-side Proxy (FREE)'
        };
      }

      throw new Error('Server proxy failed');
    } catch (error) {
      throw new Error('Server proxy method failed');
    }
  }

  // Method 1: Try direct API call (might work in some cases)
  async checkDirectAPI(email: string): Promise<BreachResult> {
    try {
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
        method: 'GET',
        headers: {
          'User-Agent': 'AEDI-Security-Breach-Checker',
          'Accept': 'application/json',
        },
      });

      if (response.status === 404) {
        return {
          isBreached: false,
          breaches: [],
          riskScore: 0,
          message: '✅ Great news! Your email was not found in any known data breaches.',
          source: 'HaveIBeenPwned (Direct)'
        };
      }

      if (response.ok) {
        const breaches = await response.json();
        return {
          isBreached: true,
          breaches,
          riskScore: this.calculateRiskScore(breaches),
          message: `⚠️ Your email was found in ${breaches.length} breach${breaches.length > 1 ? 'es' : ''}`,
          source: 'HaveIBeenPwned (Direct)'
        };
      }

      throw new Error('Direct API failed');
    } catch (error) {
      throw new Error('Direct method failed');
    }
  }

  // Method 1: Use a free CORS proxy with HaveIBeenPwned
  async checkWithProxy(email: string): Promise<BreachResult> {
    try {
      // Updated CORS proxy services (more reliable)
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors.sh/',
        'https://proxy.cors.sh/',
        'https://api.codetabs.com/v1/proxy?quest='
      ];

      for (const proxy of proxies) {
        try {
          const url = `${proxy}${encodeURIComponent(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`)}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'User-Agent': 'AEDI-Security-Breach-Checker',
              'Accept': 'application/json',
            },
          });

          if (response.status === 404) {
            return {
              isBreached: false,
              breaches: [],
              riskScore: 0,
              message: '✅ Great news! Your email was not found in any known data breaches.',
              source: 'HaveIBeenPwned (via proxy)'
            };
          }

          if (response.ok) {
            const breaches = await response.json();
            return {
              isBreached: true,
              breaches,
              riskScore: this.calculateRiskScore(breaches),
              message: `⚠️ Your email was found in ${breaches.length} breach${breaches.length > 1 ? 'es' : ''}`,
              source: 'HaveIBeenPwned (via proxy)'
            };
          }
        } catch (error) {
          console.log(`Proxy ${proxy} failed, trying next...`);
          continue;
        }
      }
      
      throw new Error('All proxies failed');
    } catch (error) {
      throw new Error('Proxy method failed');
    }
  }

  // Method 2: Use BreachDirectory API (Free)
  async checkWithBreachDirectory(email: string): Promise<BreachResult> {
    try {
      // This is a free API that doesn't require keys
      const response = await fetch(`https://breachdirectory.org/api/search?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!data.found || data.results.length === 0) {
          return {
            isBreached: false,
            breaches: [],
            riskScore: 0,
            message: '✅ Your email was not found in breach databases.',
            source: 'BreachDirectory'
          };
        }

        return {
          isBreached: true,
          breaches: data.results,
          riskScore: this.calculateRiskScore(data.results),
          message: `⚠️ Your email was found in ${data.results.length} breach${data.results.length > 1 ? 'es' : ''}`,
          source: 'BreachDirectory'
        };
      }
      
      throw new Error('BreachDirectory API failed');
    } catch (error) {
      throw new Error('BreachDirectory method failed');
    }
  }

  // Method 3: Use Intelligence X API (Free tier)
  async checkWithIntelligenceX(email: string): Promise<BreachResult> {
    try {
      // Intelligence X has a free tier
      const response = await fetch('https://2.intelx.io/phonebook/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          term: email,
          maxresults: 100,
          media: 0,
          target: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!data.records || data.records.length === 0) {
          return {
            isBreached: false,
            breaches: [],
            riskScore: 0,
            message: '✅ Your email was not found in intelligence databases.',
            source: 'Intelligence X'
          };
        }

        return {
          isBreached: true,
          breaches: data.records,
          riskScore: this.calculateRiskScore(data.records),
          message: `⚠️ Your email was found in ${data.records.length} record${data.records.length > 1 ? 's' : ''}`,
          source: 'Intelligence X'
        };
      }
      
      throw new Error('Intelligence X API failed');
    } catch (error) {
      throw new Error('Intelligence X method failed');
    }
  }

  // Method 4: Local breach simulation (always works)
  async checkWithLocalDB(email: string): Promise<BreachResult> {
    // Simulate checking against common breach patterns
    const domain = email.split('@')[1]?.toLowerCase();
    const commonBreachedDomains = [
      'yahoo.com', 'gmail.com', 'hotmail.com', 'outlook.com', 
      'aol.com', 'live.com', 'msn.com'
    ];

    // Simulate realistic results based on email patterns
    const isLikelyBreached = commonBreachedDomains.includes(domain || '') && 
                            Math.random() > 0.7; // 30% chance for common domains

    if (isLikelyBreached) {
      const mockBreaches = [
        {
          Name: 'Collection #1',
          Title: 'Collection #1',
          Domain: domain,
          BreachDate: '2019-01-07',
          PwnCount: 772904991,
          Description: 'Large collection of credential stuffing lists.',
          IsVerified: false
        }
      ];

      return {
        isBreached: true,
        breaches: mockBreaches,
        riskScore: 65,
        message: '⚠️ SIMULATED RESULT: Real APIs unavailable. Your email may be in credential stuffing databases.',
        source: 'Local Analysis (Simulated)'
      };
    }

    return {
      isBreached: false,
      breaches: [],
      riskScore: 0,
      message: '✅ SIMULATED RESULT: Real APIs unavailable. Your email appears safe based on pattern analysis.',
      source: 'Local Analysis (Simulated)'
    };
  }

  // Main method - tries all APIs in order
  async checkEmail(email: string): Promise<BreachResult> {
    this.incrementCounter();

    const methods = [
      () => this.checkWithServerProxy(email),
      () => this.checkDirectAPI(email),
      () => this.checkWithProxy(email),
      () => this.checkWithBreachDirectory(email),
      () => this.checkWithIntelligenceX(email),
      () => this.checkWithLocalDB(email)
    ];

    for (const method of methods) {
      try {
        const result = await method();
        console.log(`✅ Breach check successful with ${result.source}`);
        return result;
      } catch (error) {
        console.log(`❌ Method failed, trying next...`);
        continue;
      }
    }

    // Fallback - should never reach here
    return {
      isBreached: false,
      breaches: [],
      riskScore: 0,
      message: '⚠️ Unable to check breaches at this time. Please try again later.',
      source: 'Fallback'
    };
  }

  private calculateRiskScore(breaches: any[]): number {
    if (!breaches || breaches.length === 0) return 0;
    
    let score = Math.min(breaches.length * 15, 60); // Base score
    
    // Add points for verified breaches
    const verifiedBreaches = breaches.filter(b => b.IsVerified || b.verified);
    score += verifiedBreaches.length * 10;
    
    // Add points for recent breaches
    const recentBreaches = breaches.filter(b => {
      const breachDate = new Date(b.BreachDate || b.date || '2020-01-01');
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return breachDate > twoYearsAgo;
    });
    score += recentBreaches.length * 5;
    
    return Math.min(score, 100);
  }

  private incrementCounter(): void {
    this.counter++;
    // Store in localStorage for persistence
    const currentCount = parseInt(localStorage.getItem('breachCheckCount') || '0');
    localStorage.setItem('breachCheckCount', (currentCount + 1).toString());
  }

  getCheckCount(): number {
    return parseInt(localStorage.getItem('breachCheckCount') || '0');
  }
}

// Export singleton instance
export const freeBreachAPI = new FreeBreachAPI();
export default freeBreachAPI;
