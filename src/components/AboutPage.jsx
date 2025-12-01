import { Link } from 'react-router-dom';

/**
 * AboutPage - Product/Service landing page
 * Positions The Haunted Reader as an educational and writing tool
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-base-100" data-theme="dracula">
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-7xl">👻</span>
              <br />
              The Haunted Reader
            </h1>
            <p className="text-2xl mb-8">
              AI-Powered Multi-Perspective Text Analysis for Writers, Educators, and Content Creators
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Try It Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">The Challenge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="card-title">Writers</h3>
                <p>Struggle to see their work from different perspectives and get stuck in their own voice</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="card-title">Educators</h3>
                <p>Need engaging tools to teach literary analysis and help students understand different viewpoints</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="card-title">Content Creators</h3>
                <p>Want to adapt content for different audiences and explore alternative narrative approaches</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Solution</h2>
          <p className="text-xl text-center mb-12">
            The Haunted Reader uses AI to analyze and reinterpret text through multiple literary perspectives,
            helping you see your writing in new ways and understand how different voices shape meaning.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-primary">📚 For Education</h3>
                <ul className="space-y-2">
                  <li>✓ Teach literary analysis through interactive examples</li>
                  <li>✓ Show how author voice shapes interpretation</li>
                  <li>✓ Engage students with classic author perspectives</li>
                  <li>✓ Analyze emotional flow in literature</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-secondary">✍️ For Writers</h3>
                <ul className="space-y-2">
                  <li>✓ Get feedback from "literary spirits"</li>
                  <li>✓ Explore alternative narrative styles</li>
                  <li>✓ Identify emotional patterns in your writing</li>
                  <li>✓ Generate fresh perspectives on drafts</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-accent">🎯 For Content Creation</h3>
                <ul className="space-y-2">
                  <li>✓ Adapt content for different audiences</li>
                  <li>✓ Generate multiple versions quickly</li>
                  <li>✓ Maintain brand voice consistency</li>
                  <li>✓ Explore genre transformations</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-warning">🔬 For Research</h3>
                <ul className="space-y-2">
                  <li>✓ Analyze sentiment and emotional flow</li>
                  <li>✓ Compare writing styles objectively</li>
                  <li>✓ Study perspective and bias in texts</li>
                  <li>✓ Export data for further analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="text-5xl">1️⃣</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Upload Your Text</h3>
                <p className="text-lg">Support for TXT, PDF, and EPUB files up to 10MB. Or paste text directly.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="text-5xl">2️⃣</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Select Literary Spirits</h3>
                <p className="text-lg">Choose from 10+ perspectives: classic authors (Poe, Dickens, Austen), character viewpoints (villain, child, scholar), or abstract lenses.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="text-5xl">3️⃣</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Generate Interpretations</h3>
                <p className="text-lg">Powered by Amazon Bedrock AI, get summaries, rewrites, and analyses from each perspective in seconds.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="text-5xl">4️⃣</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Visualize & Export</h3>
                <p className="text-lg">See emotional flow timelines, compare interpretations side-by-side, and export in multiple formats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Real-World Applications</h2>
          <div className="space-y-6">
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title">📖 Literature Classes</h3>
                <p>Teachers use The Haunted Reader to show students how Poe would interpret a modern story, or how Dickens would view contemporary social issues. Makes literary analysis interactive and engaging.</p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title">✍️ Creative Writing Workshops</h3>
                <p>Writers get instant feedback on their drafts from multiple "literary mentors," helping them identify voice inconsistencies and explore alternative narrative approaches.</p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title">📱 Content Marketing</h3>
                <p>Marketing teams adapt blog posts for different audience segments, generate multiple versions of copy, and ensure brand voice consistency across channels.</p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h3 className="card-title">🎬 Screenwriting</h3>
                <p>Screenwriters explore how different characters would narrate the same scene, helping develop distinct character voices and identify plot holes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Built on Enterprise Technology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">🤖 Amazon Bedrock AI</h3>
                <p>Powered by Claude 3 Sonnet and Haiku models for high-quality, consistent text generation with enterprise-grade security.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">☁️ AWS Infrastructure</h3>
                <p>Global CDN via CloudFront, secure authentication with Cognito, and scalable S3 storage ensure fast, reliable access worldwide.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">♿ Accessibility First</h3>
                <p>WCAG 2.1 AA compliant with full keyboard navigation, screen reader support, and high contrast ratios.</p>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">🔒 Privacy & Security</h3>
                <p>Your texts are processed securely and never stored permanently. HTTPS encryption and AWS security best practices throughout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Currently Free During Beta</h2>
          <p className="text-xl mb-8">
            We're gathering feedback to build the best multi-perspective text analysis tool. 
            Try it now and help shape the future of literary AI.
          </p>
          <div className="alert alert-info max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Future Plans</h3>
              <div className="text-sm">Educational licenses • API access • Custom spirits • Team collaboration</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to See Your Text Through New Eyes?</h2>
          <p className="text-xl mb-8">
            Join writers, educators, and content creators using The Haunted Reader to unlock new perspectives.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Analyzing Text →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">👻 The Haunted Reader</p>
          <p>AI-Powered Multi-Perspective Text Analysis</p>
          <p className="text-sm">Built with Kiro • Powered by Amazon Bedrock • Deployed on AWS</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
