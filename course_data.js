/**
 * Expanded Curriculum Data
 * This file serves as the source of truth for lesson content and quiz questions.
 * It replaces the hardcoded content in lesson_player.html and quiz.html.
 */

const COURSE_DATA = {
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
                visual: `
                    <div style="background: #e3f2fd; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                        <div style="font-size: 6rem;">👋</div>
                        <div style="font-size: 2rem; font-weight: bold; color: #1565c0; margin-top: 10px;">Hello!</div>
                    </div>
                `,
                content: `
                    <p>The most common way to greet someone is to say:</p>
                    <h2 style="color: var(--primary-color); text-align: center;">"Hello!"</h2>
                    <p>You can also say <strong>"Hi"</strong> to friends.</p>
                    <p>Try waving your hand and saying "Hello" now!</p>
                `
            },
            {
                id: 2,
                title: 'Time of Day Greetings',
                visual: `
                     <div style="background: linear-gradient(to bottom, #87CEEB, #E0F7FA); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                        <div style="font-size: 5rem;">☀️</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #F57F17; margin-top: 10px;">Good Morning</div>
                    </div>
                `,
                content: `
                    <p>We say different things at different times:</p>
                    <ul>
                        <li><strong>Good Morning</strong> (Before 12 PM) ☀️</li>
                        <li><strong>Good Afternoon</strong> (12 PM to 5 PM) 🌤️</li>
                        <li><strong>Good Evening</strong> (After 5 PM) 🌙</li>
                    </ul>
                `
            },
            {
                id: 3,
                title: 'Introductions',
                visual: `
                    <div style="background: #fff3e0; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                        <div style="font-size: 5rem;">🤝</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #e65100; margin-top: 10px;">Nice to meet you!</div>
                    </div>
                `,
                content: `
                    <p>When you meet someone new, you say:</p>
                    <p><strong>"My name is..."</strong></p>
                    <p>And then:</p>
                    <p><strong>"Nice to meet you!"</strong></p>
                `
            }
        ],
        quiz: [
            {
                type: 'multiple_choice',
                question: 'What do you say to a friend?',
                options: ['Hi', 'Goodbye', 'Night', 'Sleep'],
                correctIndex: 0,
                explanation: '"Hi" is a friendly greeting.'
            },
            {
                type: 'multiple_choice',
                question: 'When do you say "Good Morning"?',
                options: ['At night', 'In the morning', 'At lunch', 'Never'],
                correctIndex: 1,
                explanation: 'We say Good Morning when the sun comes up.'
            },
            {
                type: 'speak_sentence',
                targetSentence: 'Nice to meet you',
                explanation: 'Say "Nice to meet you" clearly.'
            },
            {
                type: 'multiple_choice',
                question: 'How do you tell someone your name?',
                options: ['You are...', 'He is...', 'My name is...', 'Byebye'],
                correctIndex: 2,
                explanation: 'Start with "My name is..."'
            }
        ]
    },

    // =========================================================================
    // MODULE: COLORS & SHAPES (course_colors)
    // =========================================================================
    'course_colors': {
        id: 'course_colors',
        title: 'Colors & Shapes',
        lessons: [
            {
                id: 1,
                title: 'The Color Red',
                visual: `
                    <div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #ff5252;">
                        <div style="width: 150px; height: 150px; background-color: #ff5252; border-radius: 50%; box-shadow: 0 10px 20px rgba(255, 82, 82, 0.3);"></div>
                        <div style="font-size: 2rem; font-weight: bold; color: #ff5252; margin-top: 20px;">RED</div>
                    </div>
                `,
                content: `
                    <p>This color is <strong>Red</strong>.</p>
                    <p>Apples are Red. 🍎</p>
                    <p>Fire trucks are Red. 🚒</p>
                    <p>Strawberries are Red. 🍓</p>
                `
            },
            {
                id: 2,
                title: 'The Color Blue',
                visual: `
                    <div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #448aff;">
                        <div style="width: 150px; height: 150px; background-color: #448aff; border-radius: 10px; box-shadow: 0 10px 20px rgba(68, 138, 255, 0.3);"></div>
                        <div style="font-size: 2rem; font-weight: bold; color: #448aff; margin-top: 20px;">BLUE</div>
                    </div>
                `,
                content: `
                    <p>This color is <strong>Blue</strong>.</p>
                    <p>The Sky is Blue. ☁️</p>
                    <p>The Ocean is Blue. 🌊</p>
                    <p>Blueberries are Blue. 🫐</p>
                `
            },
            {
                id: 3,
                title: 'The Color Yellow',
                visual: `
                    <div style="background: white; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; border: 4px solid #ffd740;">
                        <div style="width: 0; height: 0; border-left: 75px solid transparent; border-right: 75px solid transparent; border-bottom: 130px solid #ffd740; filter: drop-shadow(0 10px 10px rgba(255, 215, 64, 0.3));"></div>
                        <div style="font-size: 2rem; font-weight: bold; color: #ffd740; margin-top: 20px;">YELLOW</div>
                    </div>
                `,
                content: `
                    <p>This color is <strong>Yellow</strong>.</p>
                    <p>The Sun is Yellow. ☀️</p>
                    <p>Bananas are Yellow. 🍌</p>
                    <p>Lemons are Yellow. 🍋</p>
                `
            },
             {
                id: 4,
                title: 'Mixing Colors',
                visual: `
                    <div style="background: white; height: 300px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                         <div style="width: 60px; height: 60px; background-color: #ff5252; border-radius: 50%;"></div>
                         <div style="font-size: 2rem;">+</div>
                         <div style="width: 60px; height: 60px; background-color: #ffd740; border-radius: 50%;"></div>
                         <div style="font-size: 2rem;">=</div>
                         <div style="width: 80px; height: 80px; background-color: #ff9800; border-radius: 50%;"></div>
                    </div>
                `,
                content: `
                    <p>What happens when we mix colors?</p>
                    <p><strong>Red</strong> + <strong>Yellow</strong> = <strong style="color: #ff9800;">Orange</strong> 🍊</p>
                    <p><strong>Blue</strong> + <strong>Yellow</strong> = <strong style="color: #4caf50;">Green</strong> 🟢</p>
                `
            }
        ],
        quiz: [
            {
                type: 'multiple_choice',
                question: 'Which fruit is Red?',
                options: ['Banana', 'Apple', 'Blueberry', 'Lemon'],
                correctIndex: 1,
                explanation: 'Apples are Red!'
            },
            {
                type: 'multiple_choice',
                question: 'What color is the sky?',
                options: ['Green', 'Red', 'Blue', 'Purple'],
                correctIndex: 2,
                explanation: 'The sky is Blue.'
            },
            {
                type: 'speak_sentence',
                targetSentence: 'Yellow Banana',
                explanation: 'Say "Yellow Banana"'
            },
            {
                type: 'multiple_choice',
                question: 'Red + Yellow makes...?',
                options: ['Blue', 'Purple', 'Orange', 'Black'],
                correctIndex: 2,
                explanation: 'Red and Yellow make Orange!'
            },
            {
                 type: 'multiple_choice',
                question: 'Which shape has 3 sides?',
                options: ['Circle', 'Square', 'Triangle', 'Star'],
                correctIndex: 2,
                explanation: 'A Triangle has 3 sides.'
            }
        ]
    },

    // =========================================================================
    // MODULE: NUMBERS (course_numbers)
    // =========================================================================
    'course_numbers': {
        id: 'course_numbers',
        title: 'Numbers 1-10',
        lessons: [
            {
                id: 1,
                title: 'Numbers 1, 2, 3',
                visual: `
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                        <div style="font-size: 6rem; font-weight: bold;">1 2 3</div>
                        <div style="font-size: 1.5rem; margin-top: 10px;">One, Two, Three</div>
                    </div>
                `,
                content: `
                    <p>Let's count!</p>
                    <p><strong>1</strong> (One) - One nose on your face. 👃</p>
                    <p><strong>2</strong> (Two) - Two eyes to see. 👀</p>
                    <p><strong>3</strong> (Three) - Three corners on a triangle. 🔺</p>
                `
            },
            {
                id: 2,
                title: 'Numbers 4, 5, 6',
                visual: `
                     <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                        <div style="font-size: 6rem; font-weight: bold;">4 5 6</div>
                        <div style="font-size: 1.5rem; margin-top: 10px;">Four, Five, Six</div>
                    </div>
                `,
                content: `
                    <p>Keep going!</p>
                    <p><strong>4</strong> (Four) - Four legs on a dog. 🐶</p>
                    <p><strong>5</strong> (Five) - Five fingers on a hand. 🖐️</p>
                    <p><strong>6</strong> (Six) - Six legs on an ant. 🐜</p>
                `
            },
            {
                id: 3,
                title: 'Big Numbers: 7, 8, 9, 10',
                visual: `
                     <div style="background: linear-gradient(135deg, #667eea, #764ba2); height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
                        <div style="font-size: 5rem; font-weight: bold;">7 8 9 10</div>
                        <div style="font-size: 1.5rem; margin-top: 10px;">Seven to Ten!</div>
                    </div>
                `,
                content: `
                    <p>Almost there!</p>
                    <p><strong>7</strong> (Seven) days in a week.</p>
                    <p><strong>8</strong> (Eight) legs on a spider. 🕷️</p>
                    <p><strong>9</strong> (Nine) planets... or maybe 8?</p>
                    <p><strong>10</strong> (Ten) fingers and toes! 👐</p>
                `
            }
        ],
        quiz: [
            {
                type: 'multiple_choice',
                question: 'How many eyes do you have?',
                options: ['1', '2', '5', '10'],
                correctIndex: 1,
                explanation: 'You have 2 eyes.'
            },
             {
                type: 'multiple_choice',
                question: 'What number comes after 4?',
                options: ['3', '5', '6', '2'],
                correctIndex: 1,
                explanation: '1, 2, 3, 4, 5!'
            },
            {
                type: 'speak_sentence',
                targetSentence: 'One Two Three',
                explanation: 'Count to three out loud.'
            },
            {
                type: 'multiple_choice',
                question: 'How many fingers on one hand?',
                options: ['3', '4', '5', '6'],
                correctIndex: 2,
                explanation: 'Five fingers!'
            },
            {
                type: 'multiple_choice',
                question: 'Which number is the biggest?',
                options: ['1', '5', '8', '10'],
                correctIndex: 3,
                explanation: '10 is the biggest number here.'
            }
        ]
    },

    // =========================================================================
    // MODULE: ANIMALS (course_animals)
    // =========================================================================
    'course_animals': {
        id: 'course_animals',
        title: 'Amazing Animals',
        lessons: [
            {
                id: 1,
                title: 'Farm Animals',
                visual: `
                    <div style="background: #a5d6a7; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #1b5e20;">
                         <div style="font-size: 5rem;">🐮 🐷 🐔</div>
                         <div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">On the Farm</div>
                    </div>
                `,
                content: `
                    <p>Animals that live on a farm:</p>
                    <p><strong>Cow</strong> says "Moo". 🐮</p>
                    <p><strong>Pig</strong> says "Oink". 🐷</p>
                    <p><strong>Chicken</strong> says "Cluck". 🐔</p>
                `
            },
            {
                id: 2,
                title: 'Pets at Home',
                visual: `
                    <div style="background: #ffccbc; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #bf360c;">
                         <div style="font-size: 5rem;">🐶 🐱 🐹</div>
                         <div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">House Pets</div>
                    </div>
                `,
                content: `
                    <p>Animals we keep in our house:</p>
                    <p><strong>Dog</strong> says "Woof". 🐶</p>
                    <p><strong>Cat</strong> says "Meow". 🐱</p>
                    <p><strong>Hamster</strong> runs on a wheel. 🐹</p>
                `
            },
            {
                id: 3,
                title: 'Wild Animals',
                visual: `
                    <div style="background: #fff59d; height: 300px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f57f17;">
                         <div style="font-size: 5rem;">🦁 🐘 🦒</div>
                         <div style="font-size: 1.5rem; font-weight: bold; margin-top: 10px;">In the Jungle</div>
                    </div>
                `,
                content: `
                    <p>Animals in the wild:</p>
                    <p><strong>Lion</strong> is the King. 🦁</p>
                    <p><strong>Elephant</strong> has a long trunk. 🐘</p>
                    <p><strong>Giraffe</strong> has a long neck. 🦒</p>
                `
            }
        ],
        quiz: [
             {
                type: 'multiple_choice',
                question: 'Which animal says "Moo"?',
                options: ['Dog', 'Cat', 'Cow', 'Lion'],
                correctIndex: 2,
                explanation: 'Cows say Moo!'
            },
            {
                type: 'multiple_choice',
                question: 'Which animal has a long neck?',
                options: ['Pig', 'Giraffe', 'Chicken', 'Hamster'],
                correctIndex: 1,
                explanation: 'Giraffes have very long necks.'
            },
            {
                type: 'speak_sentence',
                targetSentence: 'The dog barks',
                explanation: 'Say "The dog barks".'
            },
             {
                type: 'multiple_choice',
                question: 'Where does a Lion live?',
                options: ['In a house', 'In the jungle', 'In the sea', 'In the sky'],
                correctIndex: 1,
                explanation: 'Lions live in the jungle.'
            },
             {
                type: 'multiple_choice',
                question: 'Which is a pet?',
                options: ['Lion', 'Elephant', 'Cat', 'Giraffe'],
                correctIndex: 2,
                explanation: 'A Cat is a common pet.'
            }
        ]
    }
};
