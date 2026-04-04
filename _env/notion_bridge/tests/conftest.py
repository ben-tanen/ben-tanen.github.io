def pytest_addoption(parser):
    parser.addoption(
        "--update-snapshot",
        action="store_true",
        default=False,
        help="Update the stored snapshot fixture with current API output",
    )
