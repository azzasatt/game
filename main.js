document.body.innerHTML = '';
        document.body.style.cssText = `
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;

        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            position: relative;
            width: 800px;
            height: 600px;
        `;
        document.body.appendChild(gameContainer);

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.cssText = `
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;
        gameContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        const startModal = document.createElement('div');
        startModal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 10;
            min-width: 300px;
        `;
        gameContainer.appendChild(startModal);

        const title = document.createElement('h1');
        title.textContent = 'COSMIC BALLOON';
        title.style.cssText = `
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 32px;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        `;
        startModal.appendChild(title);

        const recordContainer = document.createElement('div');
        recordContainer.style.cssText = `
            margin: 15px 0;
            padding: 10px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 10px;
            border: 2px solid rgba(102, 126, 234, 0.3);
        `;
        startModal.appendChild(recordContainer);

        const recordText = document.createElement('div');
        recordText.textContent = 'РЕКОРД';
        recordText.style.cssText = `
            font-size: 14px;
            color: #666;
            font-weight: bold;
            margin-bottom: 5px;
        `;
        recordContainer.appendChild(recordText);

        const recordValue = document.createElement('div');
        recordValue.id = 'bestScoreDisplay';
        recordValue.textContent = '0';
        recordValue.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        `;
        recordContainer.appendChild(recordValue);

        const livesContainer = document.createElement('div');
        livesContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        `;
        startModal.appendChild(livesContainer);

        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('div');
            heart.style.cssText = `
                width: 40px;
                height: 40px;
                background: #ff6b6b;
                clip-path: path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
                animation: pulse 2s infinite ${i * 0.3}s;
            `;
            livesContainer.appendChild(heart);
        }

        const lastScore = document.createElement('div');
        lastScore.id = 'lastScore';
        lastScore.textContent = '0';
        lastScore.style.cssText = `
            font-size: 48px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        `;
        startModal.appendChild(lastScore);

        const startBtn = document.createElement('button');
        startBtn.textContent = 'START FLIGHT';
        startBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        `;
        startModal.appendChild(startBtn);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            color: #333;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border: 2px solid rgba(255,255,255,0.5);
            display: none;
        `;
        scoreDisplay.innerHTML = 'ОЧКИ: <span id="currentScore">0</span>';
        gameContainer.appendChild(scoreDisplay);

        let game = {
            running: false,
            score: 0,
            bestScore: localStorage.getItem('cosmicBalloonBestScore') || 0,
            lives: 3,
            baseSpeed: 1.5,
            currentSpeed: 1.5,
            speedMultiplier: 1.0,
            player: {
                x: 400,
                y: 300,
                radius: 20,
                velocityX: 0,
                velocityY: 0,
                color: '#1e3a8a',
                baseGravity: 0.04,
                currentGravity: 0.04
            },
            obstacles: [],
            particles: [],
            powerUps: [],
            shield: {
                active: false,
                endTime: 0,
                duration: 15000
            },
            lastPowerUpTime: 0,
            powerUpInterval: 30000,
            mouse: { x: 400, y: 300 }
        };

        recordValue.textContent = game.bestScore;

        function createObstacle() {
            const types = ['cube', 'triangle'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            game.obstacles.push({
                x: Math.random() * (canvas.width - 60) + 30,
                y: -50,
                width: 40 + Math.random() * 30,
                height: 40 + Math.random() * 30,
                type: type,
                color: '#000000',
                velocityY: game.currentSpeed + Math.random() * game.currentSpeed,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }

        function createPowerUp() {
            game.powerUps.push({
                x: Math.random() * (canvas.width - 30) + 15,
                y: -20,
                radius: 8,
                color: '#FFD700',
                glow: 0,
                glowingUp: true,
                velocityY: 0.5,
                rotation: 0
            });
        }

        function updateGameSpeed() {
            const speedLevel = Math.floor(game.score / 50);
            game.speedMultiplier = 1 + speedLevel * 0.3;
            game.currentSpeed = game.baseSpeed * game.speedMultiplier;
            game.player.currentGravity = game.player.baseGravity * game.speedMultiplier;
        }

        function createParticles(x, y, color, count) {
            for (let i = 0; i < count; i++) {
                game.particles.push({
                    x: x,
                    y: y,
                    velocityX: (Math.random() - 0.5) * 8,
                    velocityY: (Math.random() - 0.5) * 8,
                    radius: Math.random() * 4 + 2,
                    color: color,
                    life: 1.0,
                    decay: 0.02 + Math.random() * 0.02
                });
            }
        }

        function drawPlayer() {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            
            ctx.fillStyle = game.player.color;
            ctx.beginPath();
            ctx.arc(game.player.x, game.player.y, game.player.radius, 0, Math.PI * 2);
            ctx.fill();
            
            const gradient = ctx.createRadialGradient(
                game.player.x - game.player.radius * 0.3,
                game.player.y - game.player.radius * 0.3,
                0,
                game.player.x - game.player.radius * 0.3,
                game.player.y - game.player.radius * 0.3,
                game.player.radius * 0.8
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                game.player.x - game.player.radius * 0.2,
                game.player.y - game.player.radius * 0.2,
                game.player.radius * 0.6, 0, Math.PI * 2
            );
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        }

        function drawShield() {
            if (!game.shield.active) return;
            
            const timeLeft = game.shield.endTime - Date.now();
            const alpha = 0.3 + 0.2 * Math.sin(Date.now() * 0.01);
            
            ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            ctx.arc(
                game.player.x, 
                game.player.y, 
                game.player.radius + 15, 
                Math.PI * 0.8, 
                Math.PI * 1.2
            );
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = '#FFD700';
            ctx.font = '12px Arial';
            ctx.fillText(
                `Щит: ${(timeLeft/1000).toFixed(1)}с`, 
                game.player.x - 25, 
                game.player.y - game.player.radius - 25
            );
        }

        function drawPowerUps() {
            game.powerUps.forEach((powerUp, index) => {
                if (powerUp.glowingUp) {
                    powerUp.glow += 0.03;
                    if (powerUp.glow >= 1) powerUp.glowingUp = false;
                } else {
                    powerUp.glow -= 0.03;
                    if (powerUp.glow <= 0.3) powerUp.glowingUp = true;
                }
                
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 15 + powerUp.glow * 10;
                
                ctx.fillStyle = powerUp.color;
                ctx.beginPath();
                ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 255, 200, ${0.5 + powerUp.glow * 0.3})`;
                ctx.beginPath();
                ctx.arc(powerUp.x, powerUp.y, powerUp.radius * 0.6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowBlur = 0;
                
                powerUp.y += powerUp.velocityY;
                powerUp.rotation += 0.02;
                
                if (powerUp.y > canvas.height + 20) {
                    game.powerUps.splice(index, 1);
                }
            });
        }

        function drawObstacles() {
            game.obstacles.forEach(obstacle => {
                ctx.save();
                ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
                ctx.rotate(obstacle.rotation);
                
                ctx.fillStyle = obstacle.color;
                
                if (obstacle.type === 'cube') {
                    ctx.fillRect(-obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height);
                    
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height);
                    
                } else if (obstacle.type === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(0, -obstacle.height / 2);
                    ctx.lineTo(obstacle.width / 2, obstacle.height / 2);
                    ctx.lineTo(-obstacle.width / 2, obstacle.height / 2);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                
                ctx.restore();
                
                obstacle.rotation += obstacle.rotationSpeed;
                obstacle.y += obstacle.velocityY;
            });
        }

        function drawParticles() {
            game.particles.forEach((particle, index) => {
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
                
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.life -= particle.decay;
                
                if (particle.life <= 0) {
                    game.particles.splice(index, 1);
                }
            });
            ctx.globalAlpha = 1;
        }

        function drawGravityField() {
            const gradient = ctx.createRadialGradient(
                game.mouse.x, game.mouse.y, 0,
                game.mouse.x, game.mouse.y, 150
            );
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
            gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawSpeedIndicator() {
            if (game.speedMultiplier > 1) {
                ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
                ctx.font = '16px Arial';
                ctx.fillText(`Скорость: x${game.speedMultiplier.toFixed(1)}`, 20, 30);
            }
        }

        function updatePlayer() {
            const dx = game.mouse.x - game.player.x;
            const dy = game.mouse.y - game.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const force = Math.min(0.5, 300 / (distance + 100));
            
            game.player.velocityX += dx * force * game.player.currentGravity;
            game.player.velocityY += dy * force * game.player.currentGravity;
            
            game.player.velocityX *= 0.96;
            game.player.velocityY *= 0.96;
            
            game.player.x += game.player.velocityX;
            game.player.y += game.player.velocityY;
            
            game.player.x = Math.max(game.player.radius, Math.min(canvas.width - game.player.radius, game.player.x));
            game.player.y = Math.max(game.player.radius, Math.min(canvas.height - game.player.radius, game.player.y));
        }

        function checkPowerUpCollisions() {
            game.powerUps.forEach((powerUp, index) => {
                const dx = game.player.x - powerUp.x;
                const dy = game.player.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < game.player.radius + powerUp.radius) {
                    game.shield.active = true;
                    game.shield.endTime = Date.now() + game.shield.duration;
                    
                    createParticles(powerUp.x, powerUp.y, '#FFD700', 15);
                    game.powerUps.splice(index, 1);
                }
            });
        }

        function updateShield() {
            if (game.shield.active && Date.now() > game.shield.endTime) {
                game.shield.active = false;
            }
        }

        function spawnPowerUps() {
            const currentTime = Date.now();
            if (currentTime - game.lastPowerUpTime > game.powerUpInterval) {
                createPowerUp();
                game.lastPowerUpTime = currentTime;
            }
        }

        function checkCollisions() {
            game.obstacles.forEach((obstacle, index) => {
                if (obstacle.y > canvas.height) {
                    game.obstacles.splice(index, 1);
                    game.score += 5;
                    updateScore();
                    updateGameSpeed();
                    return;
                }
                
                let collision = false;
                
                if (obstacle.type === 'cube') {
                    collision = (
                        game.player.x + game.player.radius > obstacle.x &&
                        game.player.x - game.player.radius < obstacle.x + obstacle.width &&
                        game.player.y + game.player.radius > obstacle.y &&
                        game.player.y - game.player.radius < obstacle.y + obstacle.height
                    );
                } else if (obstacle.type === 'triangle') {
                    const centerX = obstacle.x + obstacle.width / 2;
                    const centerY = obstacle.y + obstacle.height / 2;
                    const distance = Math.sqrt(
                        Math.pow(game.player.x - centerX, 2) + 
                        Math.pow(game.player.y - centerY, 2)
                    );
                    collision = distance < (game.player.radius + Math.max(obstacle.width, obstacle.height) / 2);
                }
                
                if (collision && !game.shield.active) {
                    game.lives--;
                    createParticles(game.player.x, game.player.y, '#ff6b6b', 20);
                    game.obstacles.splice(index, 1);
                    
                    if (game.lives <= 0) {
                        gameOver();
                    }
                }
            });
        }

        function updateScore() {
            document.getElementById('currentScore').textContent = game.score;
            if (game.score > game.bestScore) {
                game.bestScore = game.score;
                localStorage.setItem('cosmicBalloonBestScore', game.bestScore);
                recordValue.textContent = game.bestScore;
            }
        }

        function gameOver() {
            game.running = false;
            lastScore.textContent = game.score;
            startModal.style.display = 'block';
            scoreDisplay.style.display = 'none';
            
            game.obstacles = [];
            game.particles = [];
            game.powerUps = [];
            game.shield.active = false;
            game.lives = 3;
            game.score = 0;
            game.currentSpeed = game.baseSpeed;
            game.speedMultiplier = 1.0;
            game.player.currentGravity = game.player.baseGravity;
            game.player.x = 400;
            game.player.y = 300;
            game.player.velocityX = 0;
            game.player.velocityY = 0;
            game.lastPowerUpTime = 0;
        }

        function gameLoop() {
            if (!game.running) return;
            
            ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            drawGravityField();
            drawParticles();
            drawObstacles();
            drawPowerUps();
            drawPlayer();
            drawShield();
            drawSpeedIndicator();
            
            updatePlayer();
            checkCollisions();
            checkPowerUpCollisions();
            updateShield();
            spawnPowerUps();
            
            if (Math.random() < 0.02 * game.speedMultiplier) {
                createObstacle();
            }
            
            requestAnimationFrame(gameLoop);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            game.mouse.x = e.clientX - rect.left;
            game.mouse.y = e.clientY - rect.top;
        });

        startBtn.addEventListener('click', () => {
            game.running = true;
            game.score = 0;
            game.currentSpeed = game.baseSpeed;
            game.speedMultiplier = 1.0;
            game.player.currentGravity = game.player.baseGravity;
            game.shield.active = false;
            game.powerUps = [];
            game.lastPowerUpTime = Date.now();
            startModal.style.display = 'none';
            scoreDisplay.style.display = 'block';
            updateScore();
            gameLoop();
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            button:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 25px rgba(102, 126, 234, 0.4);
            }
            
            button:active {
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(style);

        lastScore.textContent = '0';
   
