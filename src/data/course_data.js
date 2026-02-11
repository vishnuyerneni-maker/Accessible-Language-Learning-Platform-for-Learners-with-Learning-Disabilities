/**
 * Expanded Curriculum Data - All courses now have 4 lessons and 4 quiz questions
 */

export const COURSE_DATA = {
    // =========================================================================
    // MODULE 1: GREETINGS (course_101)
    // =========================================================================
    'course_101': {
        id: 'course_101',
        title: 'English Greeting Basics',
        lessons: [
            {
                id: 1,
                title: 'Saying Hello',
                visual: `<div style="background: #e3f2fd; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;"><div style="font-size: 6rem;">👋</div><div style="font-size: 2rem; font-weight: bold; color: #1565c0; margin-top: 10px;">Hello!</div></div>`,
                content: `<p>The most common way to greet someone is to say:</p><h2 style="color: var(--primary-color); text-align: center;">"Hello!"</h2><p>You can also say <strong>"Hi"</strong> to friends.</p><p>Try waving your hand and saying "Hello" now!</p>`
            },
            {
                id: 2,
                title: 'Time of Day Greetings',
                visual: `<div style="background: linear-gradient(to bottom, #87CEEB, #E0F7FA); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;"><div style="font-size: 5rem;">☀️</div><div style="font-size: 1.5rem; font-weight: bold; color: #F57F17; margin-top: 10px;">Good Morning</div></div>`,
                content: `<p>We say different things at different times:</p><ul><li><strong>Good Morning</strong> (Before 12 PM) ☀️</li><li><strong>Good Afternoon</strong> (12 PM to 5 PM) 🌤️</li><li><strong>Good Evening</strong> (After 5 PM) 🌙</li></ul>`
            },
            {
                id: 3,
                title: 'Introductions',
                visual: `<div style="background: #fff3e0; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;"><div style="font-size: 5rem;">🤝</div><div style="font-size: 1.5rem; font-weight: bold; color: #e65100; margin-top: 10px;">Nice to meet you!</div></div>`,
                content: `<p>When you meet someone new, you say:</p><p><strong>"My name is..."</strong></p><p><strong>"What's your name?"</strong></p><p>And then: <strong>"Nice to meet you!"</strong></p>`
            },
            {
                id: 4,
                title: 'Saying Goodbye',
                visual: `<div style="background: #f3e5f5; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;"><div style="font-size: 5rem;">👋</div><div style="font-size: 1.5rem; font-weight: bold; color: #7b1fa2; margin-top: 10px;">Goodbye!</div></div>`,
                content: `<p>When leaving, we say:</p><ul><li><strong>"Goodbye"</strong> - Formal</li><li><strong>"Bye"</strong> - Casual</li><li><strong>"See you later!"</strong> - Friendly</li><li><strong>"Have a nice day!"</strong> - Polite</li></ul>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'What do you say to a friend?', options: ['Hi', 'Goodbye', 'Night', 'Sleep'], correctIndex: 0, explanation: '"Hi" is a friendly greeting.' },
            { type: 'multiple_choice', question: 'When do you say "Good Morning"?', options: ['At night', 'In the morning', 'In the afternoon', 'Never'], correctIndex: 1, explanation: 'We say Good Morning when the sun comes up.' },
            { type: 'multiple_choice', question: 'What do you say when meeting someone new?', options: ['Goodbye', 'Nice to meet you', 'See you later', 'Good night'], correctIndex: 1, explanation: '"Nice to meet you" is perfect for introductions.' },
            { type: 'speak_sentence', targetSentence: 'Have a nice day', explanation: 'Say "Have a nice day" clearly.' }
        ]
    },

    // =========================================================================
    // DYSLEXIA MODULE 1: TRACING (dyslexia_101)
    // =========================================================================
    'dyslexia_101': {
        id: 'dyslexia_101',
        title: 'Letter Tracing Magic',
        lessons: [
            {
                id: 1,
                title: 'Tracing A, B, C',
                visual: `<div style="background: #fce4ec; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem; font-weight: bold; color: #d81b60;">A B C</div></div>`,
                content: `<p>Welcome to Letter Tracing! Today we start with the first three letters.</p><p><strong>A</strong> is for Apple 🍎</p><p><strong>B</strong> is for Ball ⚽</p><p><strong>C</strong> is for Cat 🐱</p><p>Head to the <strong>Dyslexia Center</strong> to practice tracing!</p>`
            },
            {
                id: 2,
                title: 'Curved Letters: O, Q, C',
                visual: `<div style="background: #e1bee7; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem; font-weight: bold; color: #8e24aa;">O Q C</div></div>`,
                content: `<p>These letters are round like a circle.</p><p>Start at the top and go around!</p><p>Try drawing a big circle in the air with your finger. ⭕</p>`
            },
            {
                id: 3,
                title: 'Straight Lines: I, L, T',
                visual: `<div style="background: #c8e6c9; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem; font-weight: bold; color: #2e7d32;">I L T</div></div>`,
                content: `<p>These letters use straight lines!</p><p><strong>I</strong> is just one line down</p><p><strong>L</strong> goes down then right</p><p><strong>T</strong> has a line across the top</p>`
            },
            {
                id: 4,
                title: 'Tricky Letters: M, N, W',
                visual: `<div style="background: #fff9c4; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem; font-weight: bold; color: #f57f17;">M N W</div></div>`,
                content: `<p>These letters have bumps and zigzags!</p><p><strong>M</strong> has two humps like a camel 🐫</p><p><strong>N</strong> has one hump</p><p><strong>W</strong> looks like two V's together</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'Which letter stands for Apple?', options: ['B', 'A', 'C', 'Z'], correctIndex: 1, explanation: 'A is for Apple!' },
            { type: 'multiple_choice', question: 'Which letter is round like a circle?', options: ['I', 'L', 'O', 'T'], correctIndex: 2, explanation: 'O is perfectly round!' },
            { type: 'multiple_choice', question: 'Which letter has two humps like a camel?', options: ['N', 'M', 'W', 'V'], correctIndex: 1, explanation: 'M has two humps!' },
            { type: 'speak_sentence', targetSentence: 'A B C', explanation: 'Say the first three letters.' }
        ]
    },

    // =========================================================================
    // DYSLEXIA MODULE 2: PHONICS (dyslexia_102)
    // =========================================================================
    'dyslexia_102': {
        id: 'dyslexia_102',
        title: 'Phonics Sound Safari',
        lessons: [
            {
                id: 1,
                title: 'Animal Sounds',
                visual: `<div style="background: #f0f4c3; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🦁 🐮</div></div>`,
                content: `<p>Letters make sounds just like animals do!</p><p>A Cow says <strong>Moo</strong>.</p><p>The letter <strong>M</strong> says <strong>/m/</strong> like in "Moon" or "Mom".</p><p>Can you make the /m/ sound?</p>`
            },
            {
                id: 2,
                title: 'Beginning Sounds',
                visual: `<div style="background: #b2dfdb; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🍎 🏀</div></div>`,
                content: `<p>Every word starts with a sound!</p><p><strong>Apple</strong> starts with /a/</p><p><strong>Ball</strong> starts with /b/</p><p>Listen carefully to the first sound you hear!</p>`
            },
            {
                id: 3,
                title: 'Rhyming Words',
                visual: `<div style="background: #ffccbc; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🐱 🎩</div></div>`,
                content: `<p>Words that sound the same at the end are rhymes!</p><p><strong>Cat</strong> and <strong>Hat</strong> rhyme</p><p><strong>Dog</strong> and <strong>Log</strong> rhyme</p><p>Can you think of more rhymes?</p>`
            },
            {
                id: 4,
                title: 'Blending Sounds',
                visual: `<div style="background: #d1c4e9; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">C + A + T</div></div>`,
                content: `<p>Put sounds together to make words!</p><p>/c/ + /a/ + /t/ = <strong>CAT</strong></p><p>/d/ + /o/ + /g/ = <strong>DOG</strong></p><p>Try it yourself in the Dyslexia Center!</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'What sound does M make?', options: ['Buh', 'Mmm', 'Sss', 'Tuh'], correctIndex: 1, explanation: 'M makes the /m/ sound.' },
            { type: 'multiple_choice', question: 'What sound does Apple start with?', options: ['/b/', '/a/', '/c/', '/d/'], correctIndex: 1, explanation: 'Apple starts with /a/!' },
            { type: 'multiple_choice', question: 'Which word rhymes with Cat?', options: ['Dog', 'Hat', 'Sun', 'Ball'], correctIndex: 1, explanation: 'Cat and Hat rhyme!' },
            { type: 'multiple_choice', question: 'What word do you get from /d/ + /o/ + /g/?', options: ['Cat', 'Bat', 'Dog', 'Log'], correctIndex: 2, explanation: '/d/ + /o/ + /g/ = Dog!' }
        ]
    },

    // =========================================================================
    // MODULE: HOME VOCABULARY (course_103)
    // =========================================================================
    'course_103': {
        id: 'course_103',
        title: 'Vocabulary: Home',
        lessons: [
            {
                id: 1,
                title: 'The Living Room',
                visual: `<div style="background: #ffe0b2; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🛋️ 📺</div></div>`,
                content: `<p>Common things in the living room:</p><p><strong>Sofa</strong>: Where we sit.</p><p><strong>TV</strong>: We watch movies.</p><p><strong>Lamp</strong>: Gives light. 💡</p>`
            },
            {
                id: 2,
                title: 'The Kitchen',
                visual: `<div style="background: #ffccbc; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🍳 🍽️</div></div>`,
                content: `<p>In the kitchen we cook and eat.</p><p><strong>Stove</strong>: For cooking.</p><p><strong>Fridge</strong>: Keeps food cold.</p><p><strong>Plate</strong>: We put food on it.</p>`
            },
            {
                id: 3,
                title: 'The Bedroom',
                visual: `<div style="background: #e1bee7; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🛏️ 🪟</div></div>`,
                content: `<p>The bedroom is where we sleep!</p><p><strong>Bed</strong>: We sleep here at night.</p><p><strong>Pillow</strong>: Soft for your head.</p><p><strong>Window</strong>: Lets in sunlight. ☀️</p>`
            },
            {
                id: 4,
                title: 'The Bathroom',
                visual: `<div style="background: #b2ebf2; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🚿 🪥</div></div>`,
                content: `<p>We get clean in the bathroom!</p><p><strong>Shower</strong>: To wash yourself.</p><p><strong>Toothbrush</strong>: For brushing teeth.</p><p><strong>Towel</strong>: To dry off.</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'Where do we keep food cold?', options: ['Oven', 'Sofa', 'Fridge', 'Lamp'], correctIndex: 2, explanation: 'The fridge keeps food cold.' },
            { type: 'multiple_choice', question: 'Where do we sleep?', options: ['Sofa', 'Bed', 'Chair', 'Floor'], correctIndex: 1, explanation: 'We sleep in a bed!' },
            { type: 'multiple_choice', question: 'What do we use to brush our teeth?', options: ['Towel', 'Pillow', 'Toothbrush', 'Plate'], correctIndex: 2, explanation: 'We use a toothbrush!' },
            { type: 'speak_sentence', targetSentence: 'I sit on the sofa', explanation: 'Say "I sit on the sofa".' }
        ]
    },

    // =========================================================================
    // MODULE: ACTIVE LISTENING (course_102)
    // =========================================================================
    'course_102': {
        id: 'course_102',
        title: 'Active Listening Skills',
        lessons: [
            {
                id: 1,
                title: 'Listen Carefully',
                visual: `<div style="background: #b2dfdb; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">👂 ✅</div></div>`,
                content: `<p>To listen well, you must pay attention.</p><p>1. Look at the speaker. 👀</p><p>2. Keep quiet. 🤫</p><p>3. Think about what they say. 🧠</p>`
            },
            {
                id: 2,
                title: 'Body Language',
                visual: `<div style="background: #f8bbd0; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🙂 👍</div></div>`,
                content: `<p>Show you're listening with your body!</p><p><strong>Nod your head</strong> to show understanding.</p><p><strong>Smile</strong> to show interest.</p><p><strong>Face the speaker</strong> with your body.</p>`
            },
            {
                id: 3,
                title: 'Ask Questions',
                visual: `<div style="background: #fff9c4; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">❓ 💭</div></div>`,
                content: `<p>Good listeners ask questions!</p><p>"Can you explain that?"</p><p>"What do you mean?"</p><p>"Can you say that again?"</p>`
            },
            {
                id: 4,
                title: 'Repeat Back',
                visual: `<div style="background: #c5cae9; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🔄 💬</div></div>`,
                content: `<p>Repeat what you heard to check understanding!</p><p>"So you're saying..."</p><p>"Let me make sure I understand..."</p><p>This shows you're really listening! 🎯</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'What should you do when listening?', options: ['Talk loudly', 'Look at the speaker', 'Sleep', 'Run away'], correctIndex: 1, explanation: 'Always look at the speaker.' },
            { type: 'multiple_choice', question: 'How can you show you\'re listening with your body?', options: ['Turn away', 'Nod your head', 'Close your eyes', 'Cover your ears'], correctIndex: 1, explanation: 'Nodding shows you understand!' },
            { type: 'multiple_choice', question: 'What should you do if you don\'t understand?', options: ['Stay quiet', 'Ask a question', 'Leave', 'Ignore it'], correctIndex: 1, explanation: 'Always ask questions if confused!' },
            { type: 'speak_sentence', targetSentence: 'Can you explain that', explanation: 'Practice asking for clarification.' }
        ]
    },

    // =========================================================================
    // MODULE: BUSINESS ENGLISH (course_104)
    // =========================================================================
    'course_104': {
        id: 'course_104',
        title: 'Business English',
        lessons: [
            {
                id: 1,
                title: 'Professional Greetings',
                visual: `<div style="background: #cfd8dc; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">💼 🤝</div></div>`,
                content: `<p>In business, we act formal.</p><p>Instead of "Hey", say <strong>"Good Morning"</strong> or <strong>"Hello"</strong>.</p><p>Useful phrase: <strong>"How do you do?"</strong></p>`
            },
            {
                id: 2,
                title: 'Email Etiquette',
                visual: `<div style="background: #bbdefb; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">📧 ✍️</div></div>`,
                content: `<p>Writing professional emails:</p><p>Start with: <strong>"Dear Mr./Ms. [Name]"</strong></p><p>End with: <strong>"Best regards"</strong> or <strong>"Sincerely"</strong></p><p>Always proofread! ✅</p>`
            },
            {
                id: 3,
                title: 'Meeting Language',
                visual: `<div style="background: #c8e6c9; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">👥 📊</div></div>`,
                content: `<p>Useful meeting phrases:</p><p><strong>"Let's get started"</strong> - Begin the meeting</p><p><strong>"I agree with that"</strong> - Show support</p><p><strong>"Could you clarify?"</strong> - Ask for details</p>`
            },
            {
                id: 4,
                title: 'Phone Calls',
                visual: `<div style="background: #f8bbd0; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">📞 💼</div></div>`,
                content: `<p>Professional phone etiquette:</p><p><strong>"This is [Your Name] calling"</strong></p><p><strong>"May I speak with...?"</strong></p><p><strong>"Thank you for your time"</strong></p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'Which is a formal greeting?', options: ['Yo!', 'Sup?', 'Good Morning', 'Hiya'], correctIndex: 2, explanation: '"Good Morning" is professional.' },
            { type: 'multiple_choice', question: 'How should you end a professional email?', options: ['Bye', 'Best regards', 'See ya', 'Later'], correctIndex: 1, explanation: '"Best regards" is professional.' },
            { type: 'multiple_choice', question: 'What do you say to start a meeting?', options: ['Hey guys', 'Let\'s get started', 'Yo', 'What\'s up'], correctIndex: 1, explanation: '"Let\'s get started" is professional.' },
            { type: 'speak_sentence', targetSentence: 'How do you do', explanation: 'Practice formal greetings.' }
        ]
    },

    // =========================================================================
    // MODULE: TRAVEL PHRASES (course_105)
    // =========================================================================
    'course_105': {
        id: 'course_105',
        title: 'Travel Phrases',
        lessons: [
            {
                id: 1,
                title: 'At the Airport',
                visual: `<div style="background: #bbdefb; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">✈️ 🎫</div></div>`,
                content: `<p>Travel words:</p><p><strong>Passport</strong>: Your travel ID.</p><p><strong>Ticket</strong>: To get on the plane.</p><p><strong>Gate</strong>: Where the plane waits.</p>`
            },
            {
                id: 2,
                title: 'At the Hotel',
                visual: `<div style="background: #fff9c4; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🏨 🔑</div></div>`,
                content: `<p>Hotel phrases:</p><p><strong>"I have a reservation"</strong></p><p><strong>"Can I have the key?"</strong></p><p><strong>"What time is checkout?"</strong></p>`
            },
            {
                id: 3,
                title: 'Asking for Directions',
                visual: `<div style="background: #c8e6c9; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🗺️ 🧭</div></div>`,
                content: `<p>Finding your way:</p><p><strong>"Where is...?"</strong></p><p><strong>"How do I get to...?"</strong></p><p><strong>"Is it far from here?"</strong></p>`
            },
            {
                id: 4,
                title: 'At a Restaurant',
                visual: `<div style="background: #ffccbc; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 6rem;">🍽️ 🥘</div></div>`,
                content: `<p>Ordering food:</p><p><strong>"Can I see the menu?"</strong></p><p><strong>"I would like..."</strong></p><p><strong>"The check, please"</strong></p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'What do you need to fly?', options: ['Ticket', 'Cat', 'Spoon', 'Lamp'], correctIndex: 0, explanation: 'You need a ticket to fly.' },
            { type: 'multiple_choice', question: 'What do you say at a hotel?', options: ['Give me food', 'I have a reservation', 'Where am I', 'Help'], correctIndex: 1, explanation: '"I have a reservation" is correct.' },
            { type: 'multiple_choice', question: 'How do you ask for directions?', options: ['Go away', 'Where is...?', 'I don\'t know', 'Goodbye'], correctIndex: 1, explanation: '"Where is...?" is the right question.' },
            { type: 'speak_sentence', targetSentence: 'Can I see the menu', explanation: 'Practice ordering at a restaurant.' }
        ]
    },

    // =========================================================================
    // PREVIOUSLY EXISTING MODULES (Colors, Numbers, Animals)
    // =========================================================================
    'course_colors': {
        id: 'course_colors',
        title: 'Colors & Shapes',
        lessons: [
            {
                id: 1,
                title: 'The Color Red',
                visual: `<div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #ff5252;"><div style="width: 150px; height: 150px; background-color: #ff5252; border-radius: 50%; box-shadow: 0 10px 20px rgba(255, 82, 82, 0.3);"></div><div style="font-size: 2rem; font-weight: bold; color: #ff5252; margin-top: 20px;">RED</div></div>`,
                content: `<p>This color is <strong>Red</strong>.</p><p>Apples are Red. 🍎</p><p>Fire trucks are Red. 🚒</p><p>Strawberries are Red. 🍓</p>`
            },
            {
                id: 2,
                title: 'The Color Blue',
                visual: `<div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #448aff;"><div style="width: 150px; height: 150px; background-color: #448aff; border-radius: 10px; box-shadow: 0 10px 20px rgba(68, 138, 255, 0.3);"></div><div style="font-size: 2rem; font-weight: bold; color: #448aff; margin-top: 20px;">BLUE</div></div>`,
                content: `<p>This color is <strong>Blue</strong>.</p><p>The Sky is Blue. ☁️</p><p>The Ocean is Blue. 🌊</p><p>Blueberries are Blue. 🫐</p>`
            },
            {
                id: 3,
                title: 'The Color Yellow',
                visual: `<div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #ffd600;"><div style="width: 150px; height: 150px; background-color: #ffd600; border-radius: 15px; box-shadow: 0 10px 20px rgba(255, 214, 0, 0.3);"></div><div style="font-size: 2rem; font-weight: bold; color: #f57f17; margin-top: 20px;">YELLOW</div></div>`,
                content: `<p>This color is <strong>Yellow</strong>.</p><p>The Sun is Yellow. ☀️</p><p>Bananas are Yellow. 🍌</p><p>Lemons are Yellow. 🍋</p>`
            },
            {
                id: 4,
                title: 'Mixing Colors',
                visual: `<div style="background: linear-gradient(135deg, #ff5252 0%, #448aff 50%, #ffd600 100%); height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center;"><div style="font-size: 3rem; font-weight: bold; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🎨 MIX!</div></div>`,
                content: `<p>Mix colors to make new ones!</p><p><strong>Red + Blue = Purple</strong> 💜</p><p><strong>Blue + Yellow = Green</strong> 💚</p><p><strong>Red + Yellow = Orange</strong> 🧡</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'Which fruit is Red?', options: ['Banana', 'Apple', 'Blueberry', 'Lemon'], correctIndex: 1, explanation: 'Apples are Red!' },
            { type: 'multiple_choice', question: 'What color is the sky?', options: ['Red', 'Blue', 'Yellow', 'Green'], correctIndex: 1, explanation: 'The sky is Blue!' },
            { type: 'multiple_choice', question: 'What color is a banana?', options: ['Red', 'Blue', 'Yellow', 'Purple'], correctIndex: 2, explanation: 'Bananas are Yellow!' },
            { type: 'multiple_choice', question: 'What do you get when you mix Red and Blue?', options: ['Green', 'Orange', 'Purple', 'Brown'], correctIndex: 2, explanation: 'Red + Blue = Purple!' }
        ]
    },
    'course_numbers': {
        id: 'course_numbers',
        title: 'Numbers 1-10',
        lessons: [
            {
                id: 1,
                title: 'Numbers 1, 2, 3',
                visual: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;"><div style="font-size: 6rem; font-weight: bold;">1 2 3</div><div style="font-size: 1.5rem; margin-top: 10px;">One, Two, Three</div></div>`,
                content: `<p>Let's count!</p><p><strong>1</strong> (One) - One nose on your face. 👃</p><p><strong>2</strong> (Two) - Two eyes to see. 👀</p><p><strong>3</strong> (Three) - Three corners on a triangle. 🔺</p>`
            },
            {
                id: 2,
                title: 'Numbers 4, 5, 6',
                visual: `<div style="background: linear-gradient(135deg, #f093fb, #f5576c); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;"><div style="font-size: 6rem; font-weight: bold;">4 5 6</div><div style="font-size: 1.5rem; margin-top: 10px;">Four, Five, Six</div></div>`,
                content: `<p>Keep counting!</p><p><strong>4</strong> (Four) - Four legs on a chair. 🪑</p><p><strong>5</strong> (Five) - Five fingers on one hand. ✋</p><p><strong>6</strong> (Six) - Six legs on an insect. 🐜</p>`
            },
            {
                id: 3,
                title: 'Numbers 7, 8, 9',
                visual: `<div style="background: linear-gradient(135deg, #4facfe, #00f2fe); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;"><div style="font-size: 6rem; font-weight: bold;">7 8 9</div><div style="font-size: 1.5rem; margin-top: 10px;">Seven, Eight, Nine</div></div>`,
                content: `<p>Almost there!</p><p><strong>7</strong> (Seven) - Seven days in a week. 📅</p><p><strong>8</strong> (Eight) - Eight legs on a spider. 🕷️</p><p><strong>9</strong> (Nine) - Nine planets (with Pluto). 🪐</p>`
            },
            {
                id: 4,
                title: 'Number 10',
                visual: `<div style="background: linear-gradient(135deg, #fa709a, #fee140); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;"><div style="font-size: 8rem; font-weight: bold;">10</div><div style="font-size: 1.5rem; margin-top: 10px;">TEN!</div></div>`,
                content: `<p>You made it to 10!</p><p><strong>10</strong> (Ten) - Ten fingers total! 🙌</p><p>Now you can count from 1 to 10!</p><p>Great job! 🎉</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'How many eyes do you have?', options: ['1', '2', '5', '10'], correctIndex: 1, explanation: 'You have 2 eyes.' },
            { type: 'multiple_choice', question: 'How many fingers on one hand?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'One hand has 5 fingers!' },
            { type: 'multiple_choice', question: 'How many days in a week?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'There are 7 days in a week!' },
            { type: 'multiple_choice', question: 'How many fingers total?', options: ['5', '8', '10', '12'], correctIndex: 2, explanation: 'You have 10 fingers total!' }
        ]
    },
    'course_animals': {
        id: 'course_animals',
        title: 'Amazing Animals',
        lessons: [
            {
                id: 1,
                title: 'Farm Animals',
                visual: `<div style="background: #a5d6a7; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #1b5e20;"><div style="font-size: 5rem;">🐮 🐷 🐔</div><div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">On the Farm</div></div>`,
                content: `<p>Animals that live on a farm:</p><p><strong>Cow</strong> says "Moo". 🐮</p><p><strong>Pig</strong> says "Oink". 🐷</p><p><strong>Chicken</strong> says "Cluck". 🐔</p>`
            },
            {
                id: 2,
                title: 'Pet Animals',
                visual: `<div style="background: #ffccbc; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #bf360c;"><div style="font-size: 5rem;">🐕 🐈 🐠</div><div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">Our Pets</div></div>`,
                content: `<p>Animals we keep as pets:</p><p><strong>Dog</strong> says "Woof". 🐕</p><p><strong>Cat</strong> says "Meow". 🐈</p><p><strong>Fish</strong> lives in water. 🐠</p>`
            },
            {
                id: 3,
                title: 'Wild Animals',
                visual: `<div style="background: #fff9c4; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f57f17;"><div style="font-size: 5rem;">🦁 🐘 🦒</div><div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">In the Wild</div></div>`,
                content: `<p>Animals in the jungle and savanna:</p><p><strong>Lion</strong> says "Roar". 🦁</p><p><strong>Elephant</strong> has a long trunk. 🐘</p><p><strong>Giraffe</strong> has a long neck. 🦒</p>`
            },
            {
                id: 4,
                title: 'Ocean Animals',
                visual: `<div style="background: #b2ebf2; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #006064;"><div style="font-size: 5rem;">🐋 🦈 🐙</div><div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">Under the Sea</div></div>`,
                content: `<p>Animals that live in the ocean:</p><p><strong>Whale</strong> is very big. 🐋</p><p><strong>Shark</strong> has sharp teeth. 🦈</p><p><strong>Octopus</strong> has 8 legs. 🐙</p>`
            }
        ],
        quiz: [
            { type: 'multiple_choice', question: 'Which animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Pig'], correctIndex: 2, explanation: 'Cows say Moo!' },
            { type: 'multiple_choice', question: 'Which animal says "Woof"?', options: ['Dog', 'Cat', 'Fish', 'Bird'], correctIndex: 0, explanation: 'Dogs say Woof!' },
            { type: 'multiple_choice', question: 'Which animal says "Roar"?', options: ['Elephant', 'Giraffe', 'Lion', 'Whale'], correctIndex: 2, explanation: 'Lions roar!' },
            { type: 'multiple_choice', question: 'How many legs does an octopus have?', options: ['4', '6', '8', '10'], correctIndex: 2, explanation: 'Octopuses have 8 legs!' }
        ]
    }
};
