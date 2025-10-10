pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo "Pulling latest code from repository..."
                git 'https://github.com/Kavinath17/gatepassproo.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo "Running containers..."
                sh 'docker-compose up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                echo "Checking running containers..."
                sh 'docker ps'
            }
        }

        stage('Cleanup') {
            steps {
                echo "Cleaning up old images..."
                sh 'docker system prune -f'
            }
        }
    }
}
