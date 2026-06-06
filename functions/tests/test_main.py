import sys
import os
import unittest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock firebase_functions.options.SecretParam before importing main
with patch('firebase_functions.options.SecretParam'):
    # Also mock firebase_admin.initialize_app
    with patch('firebase_admin.initialize_app'):
        import main

class TestEvaluateResponse(unittest.TestCase):
    @patch('main.firestore')
    @patch('main.genai')
    def test_evaluate_response_success(self, mock_genai, mock_firestore):
        # Setup mocks
        mock_client = MagicMock()
        mock_genai.Client.return_value = mock_client
        mock_response = MagicMock()
        mock_response.text = '{"is_correct": true, "error_type": null, "concept_failed": null}'
        mock_client.models.generate_content.return_value = mock_response

        # Mock the request
        req = MagicMock()
        req.auth.uid = "test-user-123"
        req.data = {"user_answer": {"Sales Amount": "Fact"}}

        # Call the function
        result = main.evaluate_response(req)
        
        self.assertTrue(result["is_correct"])
        self.assertIsNone(result["error_type"])

if __name__ == '__main__':
    unittest.main()
