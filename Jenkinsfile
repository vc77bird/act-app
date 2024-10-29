pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                // Commands to build your application, e.g., Maven, Gradle, npm, etc.
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                // Commands to run tests, e.g., unit tests, integration tests
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // Commands to deploy, e.g., Docker, Kubernetes, etc.
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            cleanWs() // Cleans up the workspace after build completion
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}