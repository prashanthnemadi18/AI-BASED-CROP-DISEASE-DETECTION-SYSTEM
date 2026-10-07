"""
Quick test to check if the backend is running
"""
import requests

def test_backend():
    print("Testing backend connection...")
    print("=" * 50)
    
    try:
        # Test basic health endpoint
        response = requests.get("http://localhost:5000/api/health", timeout=5)
        
        if response.status_code == 200:
            print("✅ SUCCESS! Backend is running!")
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        else:
            print(f"⚠️ Backend responded but with status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR!")
        print("Backend is NOT running on http://localhost:5000")
        print("\nTo fix this:")
        print("1. Open a new terminal")
        print("2. Run:")
        print('   cd "D:\\Prashanth_N_projects\\Final year project\\AI-BASED CROP DISEASE DETECTION SYSTEM\\backend"')
        print("   python app.py")
        
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT ERROR!")
        print("Backend is too slow to respond")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("=" * 50)

if __name__ == "__main__":
    test_backend()
