# Robust Architectures
<!-- layout: title -->
<!-- caption: Glenn Bech 2026 -->

## Why DevOps Matters in Architecture (and the Data That Proves It)

# Why DevOps in an Architecture Class?
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920 -->
<!-- caption: Photo by Alvaro Reyes on Unsplash -->

Architecture enables or constrains DevOps practices.

**Key insight:** You can't bolt DevOps onto poor architecture.

Today we'll prove this connection with research data.

# The Three Ways of DevOps
<!-- layout: image-left -->
<!-- image: https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1920 -->
<!-- caption: Photo by William Iven on Unsplash -->

1. **Flow** - Optimize delivery from development to production
2. **Feedback** - Amplify feedback loops throughout the system
3. **Continuous Learning** - Enable experimentation and improvement

These principles require architectural support.

# The First Way: Flow
<!-- layout: two-column -->

## What is Flow?

**Flow** means optimizing the entire value stream from idea to production.

**Key principles:**
- Make work visible
- Limit work in progress
- Reduce batch sizes
- Reduce handoffs
- Eliminate waste

<!-- column-break -->

## Architecture's Role

**Architecture can enable flow:**
- Independent deployability
- Automated testing
- Fast build times
- Clear module boundaries

**Or create bottlenecks:**
- Tight coupling between services
- Shared databases requiring coordination
- Brittle integration points
- Manual deployment steps

# The Second Way: Feedback

**Amplify feedback loops to detect and respond to problems quickly**

**Feedback mechanisms:**
- Automated testing at all levels
- Continuous monitoring and observability
- Fast deployment cycles
- A/B testing and feature flags

Architecture must be observable, testable, and deployable to enable fast feedback.

# The Third Way: Continuous Learning

**Create a culture of experimentation and improvement**

**Essential practices:**
- Learn from failures without blame
- Allocate time for improvement work
- Run controlled experiments
- Share knowledge across teams

This connects to antifragility (Part 2) and requires architectural flexibility.

# The Challenge
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920 -->
<!-- caption: Photo by Héizel Vázquez on Unsplash -->

**Where's the proof that architecture matters?**

# Enter DORA
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920 -->
<!-- caption: Photo by Carlos Muza on Unsplash -->

**DevOps Research and Assessment**

Founded by Dr. Nicole Forsgren, Jez Humble, and Gene Kim

- 10+ years of research (2014-present)
- 30,000+ survey responses
- Published findings in "Accelerate" (2018)
- Annual State of DevOps Reports
- Now part of Google Cloud

# DORA's Four Key Metrics
<!-- infographic: metrics -->
<!-- data: [{"value": "Lead Time", "label": "For Changes", "icon": "⚡", "description": "Commit to production"}, {"value": "Deployment", "label": "Frequency", "icon": "↗", "description": "How often you deploy"}, {"value": "MTTR", "label": "Mean Time to Restore", "icon": "🔄", "description": "Recovery speed"}, {"value": "Change", "label": "Failure Rate", "icon": "✓", "description": "% causing problems"}] -->

## Measuring Software Delivery Performance

These four metrics predict organizational performance and business outcomes.
<!-- Source: "Accelerate", Forsgren et al., 2018, IT Revolution Press, Chapter 2 -->

# DORA Performance: Elite vs Low
<!-- infographic: d3-radar -->
<!-- data: [{"axis": "Lead Time", "elite": 100, "low": 15, "elite_label": "< 1 hour", "low_label": "> 1 month"}, {"axis": "Deploy Frequency", "elite": 100, "low": 10, "elite_label": "Multiple/day", "low_label": "Monthly"}, {"axis": "MTTR", "elite": 100, "low": 12, "elite_label": "< 1 hour", "low_label": "> 1 week"}, {"axis": "Change Failure", "elite": 90, "low": 40, "elite_label": "0-15%", "low_label": "16-30%"}] -->

## The Performance Gap

The radar chart shows the dramatic difference between Elite and Low performers across all four DORA metrics.

**Key insight:** Elite performers deploy 208x more frequently with 106x faster lead times, while maintaining lower failure rates. Quality and speed are not a trade-off.
<!-- Source: "Accelerate", Forsgren et al., 2018, IT Revolution Press, p. 46-48 -->
<!-- Source: "2023 State of DevOps Report", DORA/Google Cloud, https://dora.dev/research/2023 -->

# Reflection Break

**Take 3 minutes to discuss:**

1. Which DORA metric would be most challenging to improve in your projects? Why?

2. How has architecture helped or hindered deployment frequency in systems you've worked on?

3. Share an architectural decision that slowed your team's ability to ship changes.

# The Key Finding
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920 -->
<!-- caption: Photo by Carlos Muza on Unsplash -->

**Elite performance correlates with loosely coupled architecture**

# The Data
<!-- infographic: comparison -->
<!-- data: [{"title": "Elite Performers", "items": ["Deploy 208x more frequently", "106x faster lead times", "2,604x faster recovery", "5x lower failure rates"]}, {"title": "Low Performers", "items": ["Monthly deployments", "Lead times in months", "Week+ recovery times", "High change failure rates"]}] -->

## Loosely Coupled Architecture Drives Performance

Teams with loosely coupled architectures dramatically outperform those with tightly coupled systems.
<!-- Source: "Accelerate", Forsgren et al., 2018, IT Revolution Press, p. 46-48 -->
<!-- Source: "2023 State of DevOps Report", DORA/Google Cloud, https://dora.dev/research/2023 -->

# What is Loosely Coupled Architecture?
<!-- layout: two-column -->

## Key Characteristics

**Independent deployability:**
- Services deploy without coordination
- No cascading changes required
- Teams work autonomously

**Clear boundaries:**
- Well-defined interfaces
- Contract-based integration
- Minimal shared dependencies

<!-- column-break -->

## Measurable Indicators

**Can you answer "yes" to these?**
- Can you deploy your service without deploying others?
- Can you test your service independently?
- Can one team make changes without waiting for another team?
- Do failures in one service not cascade to others?

If not, you have tight coupling.

# Example: Decoupled Systems
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920 -->
<!-- caption: Photo by Alvaro Reyes on Unsplash -->

**Decoupled systems enable:**
- Independent deployment of services
- Isolated testing and validation
- Parallel team development
- Limited blast radius for failures
- Fast, targeted rollbacks

# Business Impact
<!-- infographic: metrics -->
<!-- data: [{"value": "2x", "label": "Revenue Growth", "icon": "📈", "description": "High performers vs low"}, {"value": "3x", "label": "Profitability", "icon": "💰", "description": "High performers vs low"}, {"value": "50%", "label": "Market Cap", "icon": "📊", "description": "Growth advantage"}] -->

## Technical Excellence Drives Business Results

High performers demonstrate measurably better business outcomes.
<!-- Source: "Accelerate", Forsgren et al., 2018, IT Revolution Press, Chapter 2 -->
<!-- Source: "2023 Accelerate State of DevOps Report", DORA/Google Cloud, https://dora.dev/research/2023/dora-report -->

# Single-Piece Flow
<!-- layout: image-left -->
<!-- image: https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920 -->
<!-- caption: Photo by ThisisEngineering RAEng on Unsplash -->

**Lean manufacturing principle applied to software:**
- Small batch sizes reduce risk per deployment
- Continuous delivery enables fast feedback
- Reduced work in progress improves focus
- Each change can be independently validated

Architecture must support small, independent deployments.

# Architecture Patterns That Enable Flow
<!-- layout: two-column -->

## Service Design

- Microservices (with proper boundaries)
- Event-driven architecture
- API-first design
- Database per service pattern
- Saga pattern for distributed transactions

<!-- column-break -->

## Supporting Practices

- Infrastructure as code
- Automated testing at all levels
- Continuous integration/deployment
- Feature flags and dark launches
- Observability and monitoring

Each pattern supports independent deployment and fast feedback loops.

# The Virtuous Cycle
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920 -->
<!-- caption: Photo by Jungwoo Hong on Unsplash -->

**Good architecture enables:**
- Fast deployment
- Quick feedback
- Rapid learning
- Architectural improvement

This creates a reinforcing cycle of continuous improvement.

# Conclusion
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920 -->
<!-- caption: Photo by Marvin Meyer on Unsplash -->

**Architecture is not just a technical decision. It's a business enabler.**

# Key Takeaways

1. **DevOps requires architectural support** - you can't bolt it on
2. **DORA research proves** loosely coupled architecture drives elite performance
3. **Elite performers** deploy 208x more frequently with lower failure rates
4. **Business impact is measurable** - 2x revenue growth, 3x profitability
5. **Architecture enables continuous improvement** through fast feedback loops

# Bridge to Part 2

**We've seen that architecture matters. But can systems actually improve over time?**

**Next:** Antifragile systems that get stronger under stress

- Why most systems decay
- How to build systems that improve
- Chaos engineering in practice

# Questions and Discussion

**Let's discuss:**

- Your experience measuring DORA metrics
- Challenges to improving performance in your context
- Specific examples where architecture blocked DevOps
- How to make the business case for architectural investment

# References

**Key Sources:**

- Forsgren, N., Humble, J., & Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps*. IT Revolution Press.
- DORA (2023). *Accelerate State of DevOps Report 2023*. https://dora.dev
- Skelton, M., & Pais, M. (2019). *Team Topologies*. IT Revolution Press.
- Newman, S. (2021). *Building Microservices* (2nd ed.). O'Reilly Media.
