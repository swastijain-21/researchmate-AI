/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FewShotExample } from '../types/research.ts';

export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    id: 'ai-healthcare',
    topic: 'Artificial Intelligence in Healthcare',
    domain: 'Computer Science & Biomedical Informatics',
    summary: 'Investigation into machine learning integration within clinical diagnostics, diagnostic accuracy, workflow efficiencies, bioethical hurdles, algorithmic bias, and forward-looking horizons.',
    expectedOutline: [
      {
        title: '1. Introduction & Clinical Context',
        points: [
          'Evolution of computational decision support systems in modern medicine',
          'Current diagnostic bottlenecks and physician cognitive overload',
          'Research objectives, scope, and target clinical workflows'
        ]
      },
      {
        title: '2. AI Applications in Diagnostic Imaging & Pathology',
        points: [
          'Convolutional Neural Networks (CNNs) in radiology (X-ray, MRI, CT segmentation)',
          'Deep learning in digital histopathology and early oncology detection',
          'Comparative clinical diagnostic accuracy versus human clinicians'
        ]
      },
      {
        title: '3. Clinical & Operational Benefits',
        points: [
          'Accelerated triage in emergency medicine and acute trauma',
          'Reduction in diagnostic error margins and inter-observer variability',
          'Scalable healthcare access in resource-constrained rural clinics'
        ]
      },
      {
        title: '4. Critical Challenges & Technical Limitations',
        points: [
          'Data heterogeneity, class imbalance, and adversarial vulnerability',
          'Explainability (XAI) and the black-box dilemma in life-critical treatment choices',
          'Cross-institutional generalization failures and domain shift'
        ]
      },
      {
        title: '5. Bioethical Concerns & Regulatory Governance',
        points: [
          'Algorithmic bias across underrepresented demographic cohorts',
          'Patient data privacy, HIPAA/GDPR compliance, and cryptographic security',
          'Medicolegal liability frameworks: AI vendor vs. attending practitioner'
        ]
      },
      {
        title: '6. Future Scope & Synthesis',
        points: [
          'Multimodal foundation models integrating genomic and EHR data',
          'Human-in-the-loop collaborative decision-making models',
          'Strategic roadmap for ethical clinical deployment'
        ]
      }
    ],
    sampleResearchQuestions: [
      'To what extent do contemporary deep learning diagnostic models match or exceed board-certified radiologist precision in clinical trials?',
      'What algorithmic and systemic strategies best mitigate demographic bias in training datasets for automated triage systems?',
      'How do legal and bioethical frameworks assign accountability when an autonomous diagnostic assistant yields an adverse patient event?'
    ]
  },
  {
    id: 'social-media-learning',
    topic: 'Impact of Social Media on Student Learning',
    domain: 'Educational Psychology & Media Studies',
    summary: 'Empirical assessment of digital media consumption on cognitive attention, asynchronous study habits, academic GPA, peer collaborative advantages, distraction mechanics, and structural gaps in current pedagogical literature.',
    expectedOutline: [
      {
        title: '1. Introduction & Educational Context',
        points: [
          'Ubiquitous mobile connectivity and shifts in adolescent information foraging',
          'The intersection between social media platforms and formal educational ecosystems',
          'Significance of investigating cognitive and academic performance metrics'
        ]
      },
      {
        title: '2. Impact on Learning Habits & Cognitive Attention',
        points: [
          'Continuous partial attention, task switching, and study interruptions',
          'Dopaminergic reward loops, notifications, and time-displacement of deep study',
          'Sleep disruption correlations and downstream memory consolidation impairment'
        ]
      },
      {
        title: '3. Empirical Academic Performance Outcomes',
        points: [
          'Statistical correlations between high daily screen time and GPA fluctuations',
          'Subject-specific variance: analytical STEM coursework versus creative disciplines',
          'Self-efficacy, procrastination indices, and academic burnout metrics'
        ]
      },
      {
        title: '4. Pedagogical Advantages & Collaborative Networks',
        points: [
          'Asynchronous peer support groups and global student knowledge exchange',
          'Micro-learning, visual educational creators, and democratized study resources',
          'Enhanced digital literacy and collaborative problem-solving skills'
        ]
      },
      {
        title: '5. Disadvantages & Psychosocial Mediators',
        points: [
          'Cyberbullying, academic comparison anxiety, and fear of missing out (FOMO)',
          'Echo chambers, misinformation proliferation, and reduced critical evaluation',
          'Passive consumption versus active conceptual engagement'
        ]
      },
      {
        title: '6. Identification of Research Gaps & Future Directions',
        points: [
          'Scarcity of longitudinal panel studies tracking students across multi-year transitions',
          'Confounding socioeconomic variables in remote vs. in-person classroom setups',
          'Institutional recommendations for digital wellness curricula and hybrid guidelines'
        ]
      }
    ],
    sampleResearchQuestions: [
      'How does daily multi-platform task switching during study hours correlate with retention performance in undergraduate coursework?',
      'In what ways do student-led collaborative digital study communities mitigate the negative distractions of social networking platforms?',
      'What longitudinal research methodologies are needed to isolate socioeconomic mediators from digital screen-time impacts?'
    ]
  },
  {
    id: 'renewable-energy-storage',
    topic: 'Grid-Scale Energy Storage for Renewable Integration',
    domain: 'Clean Energy & Electrical Engineering',
    summary: 'Comprehensive analysis of intermittent solar/wind generation balancing, solid-state versus flow battery architectures, levelized cost of storage, supply chain bottlenecks, and grid stability standards.',
    expectedOutline: [
      {
        title: '1. Introduction & Renewable Grid Dynamics',
        points: [
          'Intermittency challenges and the duck curve in high-penetration renewable grids',
          'Grid frequency regulation, peak shaving, and spinning reserve requirements',
          'Methodological scope and technological evaluation criteria'
        ]
      },
      {
        title: '2. Comparative Storage Technologies',
        points: [
          'Lithium iron phosphate (LFP) vs. vanadium redox flow batteries (VRFB)',
          'Pumped thermal, compressed air (CAES), and gravity-based mechanical storage',
          'Round-trip efficiency, degradation kinetics, and thermal runaway hazards'
        ]
      },
      {
        title: '3. Economic Viability & Levelized Cost of Storage (LCOS)',
        points: [
          'Capital expenditure trajectories and manufacturing economies of scale',
          'Wholesale electricity market arbitrage and ancillary services monetization',
          'Supply chain vulnerability for critical minerals (lithium, cobalt, nickel)'
        ]
      },
      {
        title: '4. Grid Architecture & Control Algorithms',
        points: [
          'Grid-forming versus grid-following inverters in weak synchronous grids',
          'AI-driven predictive dispatch optimizing day-ahead weather forecasts',
          'Distributed energy resource management systems (DERMS)'
        ]
      },
      {
        title: '5. Policy Frameworks, Standards & Future Trajectory',
        points: [
          'IEEE 1547 and 2800 interconnection compliance standards',
          'Circular economy: battery second-life repurposing and hydrometallurgical recycling',
          'Conclusion and long-duration energy storage (LDES) research priorities'
        ]
      }
    ],
    sampleResearchQuestions: [
      'How do vanadium redox flow batteries compare to lithium-based chemistry in 10+ hour duration grid stabilization economics?',
      'What control algorithms minimize battery cyclic aging while providing frequency regulation in high-wind regional grids?',
      'What regulatory tariffs best incentivize private sector investment into long-duration energy storage infrastructure?'
    ]
  }
];
