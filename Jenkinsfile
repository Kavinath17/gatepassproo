pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Kavinath17/gatepassproo.git',
                    credentialsId: 'github_gatepasspro_credentials'
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
