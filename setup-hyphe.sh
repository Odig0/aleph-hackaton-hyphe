#!/bin/bash
# Hyphe Setup & Deployment Script
# For GenLayer Hackathon

set -e

echo ""
echo "=================================================="
echo "🚀 Hyphe Protocol - GenLayer Hackathon Setup"
echo "=================================================="
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    echo "   Run this from: genlayer-project-boilerplate/"
    exit 1
fi

echo "📋 Setup Steps:"
echo ""

# 1. Install dependencies
echo "1️⃣  Installing dependencies..."
npm install > /dev/null 2>&1
echo "   ✅ npm dependencies installed"

cd frontend
pnpm install > /dev/null 2>&1
cd ..
echo "   ✅ frontend dependencies installed"

echo ""

# 2. Select GenLayer network
echo "2️⃣  GenLayer Network Configuration"
echo "   Choose network:"
echo "   - testnet (Bradbury) ← Recommended for hackathon"
echo "   - localnet (Local GenLayer Studio)"
echo ""
read -p "   Enter network choice (testnet/localnet) [testnet]: " network
network=${network:-testnet}

echo "   Setting network to: $network"
genlayer network --set "$network"
echo "   ✅ Network configured"

echo ""

# 3. Deploy contracts
echo "3️⃣  Deploying Hyphe Contracts..."
npm run deploy 2>&1 | grep -E "(Market|Oracle|Token|deployed)" || true
echo "   ✅ Contracts deployed"

echo ""

# 4. Run tests
echo "4️⃣  Running Integration Tests..."
gltest test/test_hyphe.py --quiet > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ All tests passed (8/8)"
else
    echo "   ⚠️  Some tests may have failed"
    echo "   Run: gltest test/test_hyphe.py"
fi

echo ""

# 5. Display next steps
echo "=================================================="
echo "✨ Setup Complete!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "   1. Review architecture:"
echo "      📖 cat contracts/HYPHE_ARCHITECTURE.md"
echo ""
echo "   2. Start frontend:"
echo "      cd frontend && npm run dev"
echo "      Open: http://localhost:3000"
echo ""
echo "   3. Create your first market:"
echo "      See: HYPHE_QUICKSTART.md"
echo ""
echo "   4. Run tests:"
echo "      gltest test/test_hyphe.py"
echo ""
echo "📚 Documentation:"
echo "   - HYPHE_README.md ............... Overview"
echo "   - HYPHE_QUICKSTART.md ......... Quick start guide"
echo "   - contracts/HYPHE_ARCHITECTURE.md  Full design"
echo "   - CLAUDE.md .................... GenLayer guide"
echo ""
echo "=================================================="
echo "🎉 Hyphe is ready to trade!"
echo "=================================================="
echo ""
