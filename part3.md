# Can AI Replace Architects?
<!-- layout: title -->
<!-- caption: Glenn Bech 2026 -->

## A Journey Through Building QuizRiot with AI Assistance

# The Central Question
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920 -->
<!-- caption: Photo by Mojahid Mottakin on Unsplash -->

**Can AI replace architects—or take the architect's job?**

# The Common Assumption

**What people assume AI can do:**

> "Just prompt: 'Make me Kahoot' and you're done, right?"

**The reality:**
- AI doesn't understand your constraints
- AI doesn't know your business context
- AI suggests patterns, not solutions
- Architecture requires judgment AI lacks

Let me show you what actually happens.

# My Journey: Building QuizRiot

**[INSERT: Your personal story and QuizRiot screenshots]**

**Why I built QuizRiot:**
- [Your motivation]
- [What made it different]
- [Why you chose to use AI as a partner]

This is a real case study, not theory.

# The Architecture Challenge
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920 -->
<!-- caption: Photo by Luca Bravo on Unsplash -->

**Unique requirements:**
- Real-time quiz sessions with hundreds of concurrent users
- Instant feedback for all participants
- Scale up and down rapidly
- Cost-effective at varying loads

Standard patterns don't fit these constraints.

# The Unique Solution
<!-- layout: two-column -->

## My Approach

**[INSERT: QuizRiot architecture diagram]**

**Key decisions:**
- Containers per session
- Instant EC2 startup (sub-second)
- Event-driven scaling
- Session-based isolation

<!-- column-break -->

## Why This Works

**Benefits:**
- Independent session scaling
- Predictable resource allocation
- Fast startup enables on-demand
- Cost scales with actual usage

**Constraints addressed:**
- Real-time performance guaranteed
- No noisy neighbor problems
- Simple mental model
- Measurable costs per session

# What AI Suggested
<!-- layout: two-column -->

## AI's Recommendations

**Standard patterns AI proposed:**
- "Use AWS Fargate for container orchestration"
- "Implement auto-scaling groups"
- "Consider managed Kubernetes (EKS)"
- "WebSocket connections to shared backend"

All reasonable, all wrong for my constraints.

<!-- column-break -->

## Why AI Missed

**What AI didn't understand:**
- My cost constraints
- Session isolation requirements
- Startup time criticality
- Operational complexity tolerance

**AI knows patterns.**
**AI doesn't know your context.**

# Cost Analysis
<!-- layout: image-left -->
<!-- image: https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920 -->
<!-- caption: Photo by Adeolu Eletu on Unsplash -->

**Fargate approach (AI suggestion):**
- Always-on containers for peak load
- 24/7 costs even with no sessions
- Complex orchestration overhead

**My approach:**
- Pay only for active sessions
- Sub-second startup enables true on-demand
- Simpler operational model

Cost difference: 70% reduction for typical usage pattern.

# Where AI Excelled
<!-- layout: two-column -->

## Code Generation

AI handled implementation details:
- Lambda function boilerplate
- API Gateway configurations
- CloudWatch metrics setup
- Basic error handling

Speed improvement: 3-5x faster than manual coding.

<!-- column-break -->

## Infrastructure as Code

AI generated Terraform:
- Resource definitions
- IAM policies
- Networking configurations
- Standard patterns

Quality: Good starting point, required review and refinement.

# AI for Organization
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1920 -->
<!-- caption: Photo by Héizel Vázquez on Unsplash -->

**AI helped with:**
- Project structure and file organization
- Documentation templates
- API specifications
- README and setup guides

This is where AI shines: structured, repetitive tasks with clear patterns.

# Reflection Break

**Take 3 minutes to discuss:**

1. When you've used AI for technical decisions, where did it excel? Where did it fall short?

2. Thinking about QuizRiot: If you described your project to AI, what context would it miss?

3. Share an architectural decision where AI suggestions wouldn't capture the full picture.

# AI as a Rubber Duck
<!-- layout: image-left -->
<!-- image: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920 -->
<!-- caption: Photo by Markus Spiske on Unsplash -->

**The value of explaining to AI:**
- Articulating ideas clarifies thinking
- AI asks questions that prompt deeper analysis
- Exploring alternatives reveals trade-offs
- Writing forces precision

**But:** Final decisions still require human judgment.

# What AI Provided vs What I Decided
<!-- layout: image-right -->
<!-- image: https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=1920 -->
<!-- caption: Photo by Hunter Haley on Unsplash -->

**AI suggested:** Standard patterns from common use cases

**I decided:** Custom architecture based on specific constraints

**The difference:** Context, creativity, and trade-off evaluation

# The Architect's Role
<!-- layout: two-column -->

## What AI Cannot Replace

**Context awareness:**
- Business constraints
- Cost targets
- Team capabilities
- Operational preferences
- Political realities

**Creative problem-solving:**
- Novel solutions to unique problems
- Combining patterns in new ways
- Questioning assumptions

<!-- column-break -->

## Strategic Decision-Making

**[INSERT: Decision matrix you performed]**

**Trade-offs I evaluated:**
- Cost vs complexity
- Flexibility vs simplicity
- Performance vs operational burden
- Build vs buy decisions

AI can't weigh these without your values and priorities.

# A Specific Decision Point

**Example: Container orchestration choice**

**Factors AI couldn't evaluate:**
- My comfort level with Kubernetes
- Team size (solo developer)
- Acceptable operational complexity
- Preference for managed services
- Budget constraints
- Timeline pressure

**My decision:** Simple EC2 + Docker, skip orchestration entirely.

AI would suggest Kubernetes. I chose simplicity.

# AI's Strengths
<!-- infographic: comparison -->
<!-- data: [{"title": "AI Excels At", "items": ["Code generation", "Boilerplate reduction", "Pattern application", "Documentation", "Syntax and APIs"]}, {"title": "AI Struggles With", "items": ["Novel architectures", "Constraint evaluation", "Trade-off decisions", "Context understanding", "Strategic thinking"]}] -->

## Understanding AI's Capabilities

Use AI for what it does well. Don't expect it to replace judgment.

# The Collaboration Model
<!-- layout: image-left -->
<!-- image: https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920 -->
<!-- caption: Photo by Mimi Thian on Unsplash -->

**Human provides:**
- Problem definition
- Constraints and context
- Trade-off priorities
- Final decisions
- Strategic direction

**AI provides:**
- Implementation speed
- Pattern knowledge
- Code generation
- Documentation
- Exploration of options

Together: Better than either alone.

# Conclusion
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920 -->
<!-- caption: Photo by Alex Knight on Unsplash -->

**AI augments architects. It doesn't replace them.**

# Why Architects Remain Essential

**Architects provide:**

1. **Context** - Understanding constraints AI can't see
2. **Creativity** - Innovative solutions to novel problems
3. **Trade-offs** - Balancing competing priorities
4. **Strategy** - Long-term vision and direction
5. **Judgment** - Decisions under uncertainty

These remain uniquely human capabilities.

# Future Outlook
<!-- layout: two-column -->

## AI Will Improve

**Likely developments:**
- Better context understanding
- Improved constraint reasoning
- More sophisticated trade-off analysis
- Enhanced code generation
- Deeper pattern knowledge

<!-- column-break -->

## Architects Will Evolve

**What won't change:**
- Need for strategic thinking
- Importance of context
- Value of experience
- Creative problem-solving
- Human judgment under uncertainty

**What will change:**
- Higher productivity with AI tools
- Focus on higher-level decisions
- Less time on implementation details

# The QuizRiot Lessons

**What I learned building with AI:**

1. **AI accelerates** but doesn't eliminate thinking
2. **Context is everything** - AI lacks it
3. **Standard patterns** don't fit unique constraints
4. **Human judgment** remains critical
5. **Collaboration works** - use AI as a partner, not a replacement

# Practical Advice

**How to work effectively with AI:**

- **Be specific** about constraints and context
- **Question suggestions** - don't accept blindly
- **Use AI for speed** on implementation
- **Make strategic decisions** yourself
- **Iterate and refine** AI-generated code
- **Maintain critical thinking** always

AI is a tool. You're still the architect.

# Connection to the Lab

**Applying this to decoupling exercises:**

**Today you'll practice:**
- Using AI to help with implementation
- Making your own architectural decisions
- Evaluating trade-offs
- Balancing AI suggestions with requirements

Experience the balance firsthand.

# Key Takeaways

1. **AI is excellent at implementation** but not innovation
2. **Architects provide context** AI cannot have
3. **Use AI to augment** your capabilities, not replace judgment
4. **Strategic thinking** remains uniquely human
5. **The future is collaboration** - human + AI

# The Real Question
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=1920 -->
<!-- caption: Photo by Hunter Haley on Unsplash -->

**Not "Can AI replace architects?" but "How can architects leverage AI effectively?"**

# Questions and Discussion

**Let's discuss:**

- Your experiences using AI for architecture decisions
- Where has AI helped or hindered your work?
- What decisions do you think AI will never make well?
- How are you preparing for increased AI capabilities?
- Ethical considerations of AI in architecture

# References

**Key Sources:**

- Brooks, F. P. (1987). "No Silver Bullet—Essence and Accident in Software Engineering." *Computer*, 20(4), 10-19.
- Forsgren, N., et al. (2023). "The Role of AI in Software Development." *ACM Queue*, 21(2).
- Humble, J., & Farley, D. (2010). *Continuous Delivery*. Addison-Wesley.
- Your QuizRiot case study (provide link to blog/repo if available)
- OpenAI, Anthropic, and GitHub documentation on AI-assisted development

# Final Thought
<!-- layout: image-focus -->
<!-- image: https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920 -->
<!-- caption: Photo by Marvin Meyer on Unsplash -->

**The best architectures will come from architects who know how to work with AI, not from AI alone.**
