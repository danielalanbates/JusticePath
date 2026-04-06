# Contributing to JusticePath

Thank you for wanting to contribute to JusticePath. This project exists to serve people who need it most.

## How to Contribute

### Developers
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Legal Professionals
- Review and improve legal content accuracy
- Add jurisdiction-specific resources
- Contribute document templates
- Verify resource directory entries

### Advocates & Social Workers
- Improve resource descriptions
- Add local service providers
- Review rehabilitation content
- Suggest missing features

### Formerly Incarcerated Individuals
- Share what would have helped you
- Review content for accuracy and tone
- Suggest features based on lived experience
- Help us avoid harmful assumptions

## Code of Conduct

- Treat everyone with dignity and respect
- No judgment, no stigma
- Privacy is paramount — never share others' stories without permission
- Assume good intentions
- Focus on solutions, not problems

## Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/JusticePath.git
cd JusticePath

# Install all dependencies
npm run install:all

# Set up environment files
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# Create database
createdb justicepath

# Run migrations
cd server && npm run migrate

# Start development
npm run dev
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
