
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { DollarSign, Trophy, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 animate-slide-down">
              <div className="inline-block mb-3 text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
                Virtual Betting Game
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Bet on Your Lucky Numbers
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                A multiplayer betting game with virtual currency. Join games, place bets, and win big with your lucky numbers!
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/lobby')}
                  className="py-3 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Find a Game
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="py-3 px-6 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors"
                >
                  Create Your Own
                </button>
              </div>
            </div>
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Virtual Currency</h3>
                <p className="text-muted-foreground">
                  Start with $10,000 in virtual currency to place bets without risking real money.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiplayer Games</h3>
                <p className="text-muted-foreground">
                  Join games with other players or create your own with custom settings.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">10x Payouts</h3>
                <p className="text-muted-foreground">
                  Win 10 times your bet amount when your lucky number hits.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 bg-secondary/50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Betting on your lucky numbers is simple and fun. Follow these steps to get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Join a Game</h3>
                <p className="text-muted-foreground">
                  Browse available games in the lobby or create your own game with custom settings.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Place Your Bets</h3>
                <p className="text-muted-foreground">
                  Select a number between 1 and 100, and set your bet amount within the game limits.
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Win Big</h3>
                <p className="text-muted-foreground">
                  When the timer ends, a winning number is drawn. If it's your number, you win 10x your bet!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="glass-card p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Test Your Luck?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join a game now and start betting on your lucky numbers with $10,000 in virtual currency.
              </p>
              <button
                onClick={() => navigate('/lobby')}
                className="py-3 px-8 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Start Betting Now
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 bg-secondary/30">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BetBuddy. All rights reserved. This is a virtual betting game with no real money involved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
